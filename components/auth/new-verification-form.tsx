"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"

import { newVerification } from "@/actions/new-verification"
import { CardWrapper } from "./card-wrapper"
import { BeatLoader } from "react-spinners"
import { FeedbackParamsProps, FormFeedback } from "../form-feedback"

export const NewVerificationForm = () => {

    const [feedback, setFeedback] = useState<FeedbackParamsProps>()
    const router = useRouter()

    const searchParams = useSearchParams()
    const token = searchParams.get("token")

    const onSubmit = useCallback(async () => {
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
            if (type === "success") {
                router.replace('/auth/login')
            }
        } catch (err) {
            setFeedback({
                type: "error",
                message: "Something went wrong."
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

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