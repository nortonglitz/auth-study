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
import { FormFeedback, FeedbackParamsProps } from "../form-feedback"
import Link from "next/link"

export const LoginForm = () => {

    const searchParams = useSearchParams()
    const urlError = searchParams.get("error")

    const [feedback, setFeedback] = useState<FeedbackParamsProps>({})

    const [isPending, startTransition] = useTransition()

    useEffect(() => {
        if (urlError === "OAuthAccountNotLinked") {
            setFeedback({
                type: "error",
                message: "Email already in use by another provider."
            })
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
            setFeedback({
                type,
                message
            })
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
                        <Button
                            size="sm"
                            variant="link"
                            asChild
                            className="
                                px-0 font-normal
                            "
                        >
                            <Link href="/auth/reset">
                                Forgot password?
                            </Link>
                        </Button>
                    </div>
                    <FormFeedback
                        feedback={feedback}
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