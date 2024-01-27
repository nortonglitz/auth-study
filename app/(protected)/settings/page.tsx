"use client"

import { useState, useTransition } from "react"

import * as z from "zod"
import { useForm } from "react-hook-form"
import { SettingsSchema } from "@/schemas"
import { useSession } from "next-auth/react"

import {
    Card,
    CardHeader,
    CardContent
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { settings } from "@/actions/settings"
import { FormFeedback } from "@/components/form-feedback"

import { Switch } from "@/components/ui/switch"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"

import {
    Form,
    FormField,
    FormControl,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { FeedbackParamsProps } from "@/components/form-feedback"
import { UserRole } from "@prisma/client"

const SettingsPage = () => {


    const [isPending, startTransition] = useTransition()
    const { update, data } = useSession()
    const [feedback, setFeedback] = useState<FeedbackParamsProps>()

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            role: data?.user.role || UserRole.USER,
            email: undefined,
            name: undefined,
            password: undefined,
            newPassword: undefined,
            isTwoFactorEnabled: data?.user.isTwoFactorEnabled || false
        }
    })

    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
        startTransition(async () => {
            const { message, type } = await settings(values)
            if (type === "success") {
                await update()
            }

            setFeedback({
                type,
                message
            })

        })
    }

    const normalUserComponents = (
        <>
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                placeholder={data?.user.email || "name@domain.com"}
                                disabled={isPending}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="password"
                                placeholder="******"
                                disabled={isPending}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                type="password"
                                placeholder="******"
                                disabled={isPending}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                    <FormItem
                        className="
                            flex
                            flex-row
                            items-center
                            justify-between
                            rounded-lg
                            border
                            p-3
                            shadow-sm
                        "
                    >
                        <div className="space-y-0.5">
                            <FormLabel>Two Factor Authentication</FormLabel>
                            <FormDescription>
                                You will be sent one code everytime before you log in
                            </FormDescription>
                        </div>
                        <FormControl>
                            <Switch
                                disabled={isPending}
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
        </>
    )

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    ⚙️ Settings
                </p>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder={data?.user.name || "Name"}
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {!data?.user.isOAuth && normalUserComponents}
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <Select
                                            disabled={isPending}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                                                <SelectItem value={UserRole.USER}>User</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {feedback && <FormFeedback feedback={feedback} />}
                        <Button type="submit" disabled={isPending}>Save</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default SettingsPage