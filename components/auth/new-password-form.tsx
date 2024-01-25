"use client"

import * as z from "zod"
import { useTransition, useState } from "react"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { newPassword } from "@/actions/new-password"
import { NewPasswordSchema } from "@/schemas"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form"

import { useSearchParams } from "next/navigation"
import { CardWrapper } from "./card-wrapper"
import { FormFeedback, FeedbackParamsProps } from "../form-feedback"

export const NewPasswordForm = () => {

    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const [feedback, setFeedback] = useState<FeedbackParamsProps>({})

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: ""
        }
    })

    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        startTransition(async () => {
            const { type, message } = await newPassword(values, token)
            setFeedback({
                type,
                message
            })
        })
    }


    return (
        <CardWrapper
            headerLabel="Enter a new password"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="password"
                            render={(({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            {...field}
                                            type="password"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ))}
                        />
                    </div>
                    <FormFeedback
                        feedback={feedback}
                    />
                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full"
                    >
                        Reset password
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}