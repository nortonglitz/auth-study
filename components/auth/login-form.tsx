"use client"

import * as z from "zod"
import { useTransition, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useSearchParams } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { login } from "@/actions/login"
import { LoginSchema } from "@/schemas"
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

import { CardWrapper } from "./card-wrapper"
import { FormFeedback } from "../form-feedback"

export const LoginForm = () => {

    const searchParams = useSearchParams()
    const urlError = searchParams.get("error")

    const [feedbackType, setFeedbackType] = useState<"success" | "error" | "warning">("success")
    const [feedbackMessage, setFeedbackMessage] = useState('')

    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        if (urlError === "OAuthAccountNotLinked") {
            setFeedbackType("error")
            setFeedbackMessage("Email already in use by another provider.")
        }
    }, [urlError])

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        startTransition(async () => {
            const { type, message } = await login(values)
            setFeedbackMessage(message)
            setFeedbackType(type)
        })
    }


    return (
        <CardWrapper
            headerLabel="Welcome back"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
            showSocial
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={(({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isPending}
                                            {...field}
                                            placeholder="example@domain.com"
                                            type="email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            ))}
                        />
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
                        type={feedbackType}
                        message={feedbackMessage}
                    />
                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full"
                    >
                        Login
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}