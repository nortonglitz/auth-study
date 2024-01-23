import { ExclamationTriangleIcon, CheckCircledIcon } from "@radix-ui/react-icons"

interface FormFeedbackProps {
    message?: string
    type: "success" | "error"
}

export const FormFeedback = ({
    message,
    type
}: FormFeedbackProps) => {
    if (!message) return null

    return (
        <div
            className={`
                ${type === "error" ? "bg-destructive/15" : "bg-emerald-500/15"}
                ${type === "error" ? "text-destructive" : "text-emerald-500"}
                p-3 
                rounded-md 
                flex 
                items-center 
                gap-x-2 
                text-sm 
            `}
        >
            {type === "error" && <ExclamationTriangleIcon className="h-4 w-4" />}
            {type === "success" && <CheckCircledIcon className="h-4 w-4" />}
            <p>{message}</p>
        </div>
    )
}