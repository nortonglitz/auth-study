import { ExclamationTriangleIcon, CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons"

export type FeedbackParamsProps = {
    message?: string
    type?: "success" | "error" | "warning"
}

interface FeedbackProps {
    feedback: FeedbackParamsProps
}

export const FormFeedback = ({
    feedback: {
        message,
        type
    }
}: FeedbackProps) => {
    if (!message) return null

    return (
        <div
            className={`
                ${type === "error" ? "bg-destructive/15" : ""}
                ${type === "error" ? "text-destructive" : ""}
                ${type === "success" ? "bg-emerald-500/15" : ""}
                ${type === "success" ? "text-emerald-500" : ""}
                ${type === "warning" ? "bg-yellow-500/15" : ""}
                ${type === "warning" ? "text-yellow-600" : ""}
                p-3 
                rounded-md 
                flex 
                items-center 
                gap-x-2 
                text-sm 
            `}
        >
            {type === "error" && <CrossCircledIcon className="h-4 w-4" />}
            {type === "success" && <CheckCircledIcon className="h-4 w-4" />}
            {type === "warning" && <ExclamationTriangleIcon className="h-4 w-4" />}
            <p>{message}</p>
        </div>
    )
}