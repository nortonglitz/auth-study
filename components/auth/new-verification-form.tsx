"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import { newVerification } from "@/actions/new-verification"
import { CardWrapper } from "./card-wrapper"
import { BeatLoader } from "react-spinners"
import { FeedbackParamsProps, FormFeedback } from "../form-feedback"

let tokenVerified = false

export const NewVerificationForm = () => {

    const [feedback, setFeedback] = useState<FeedbackParamsProps>()

    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const onSubmit = useCallback(async () => {
        if (tokenVerified) return
        tokenVerified = true
        if (!token) {
            setFeedback({
                type: "error",
                message: "Missing token"
            })
            return
        }

        try {
            const { message, type } = await newVerification(token)
            setFeedback({ message, type })
        } catch (err) {
            setFeedback({
                type: "error",
                message: "Something went wrong."
            })
        }

    }, [token])

    useEffect(() => {
        onSubmit()
    }, [onSubmit])

    return (
        <CardWrapper
            headerLabel="Confirming your verfication"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
        >
            <div
                className="
                    flex
                    items-center
                    w-full
                    justify-center
                "
            >
                {!feedback ? <BeatLoader /> : <FormFeedback feedback={feedback} />}
            </div>
        </CardWrapper>
    )
}