"use client"

import * as z from "zod"
import { useTransition, useState } from "react"
import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"
import { reset } from "@/actions/reset"
import { ResetSchema } from "@/schemas"
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

export const ResetForm = () => {

    const [feedback, setFeedback] = useState<FeedbackParamsProps>({})

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: ""
        }
    })

    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        startTransition(async () => {
            const { type, message } = await reset(values)
            setFeedback({
                type,
                message
            })
        })
    }


    return (
        <CardWrapper
            headerLabel="Forgot your password?"
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
                    </div>
                    <FormFeedback
                        feedback={feedback}
                    />
                    <Button
                        disabled={isPending}
                        type="submit"
                        className="w-full"
                    >
                        Send reset email
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}