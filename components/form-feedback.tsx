import { ExclamationTriangleIcon, CheckCircledIcon } from "@radix-ui/react-icons"

interface FormFeedbackProps {
    message?: string
    error?: boolean
}

export const FormFeedback = ({
    message,
    error = false
}: FormFeedbackProps) => {
    if (!message) return null

    return (
        <div
            className={`
                ${error ? "bg-destructive/15" : "bg-emerald-500/15"}
                ${error ? "text-destructive" : "text-emerald-500"}
                p-3 
                rounded-md 
                flex 
                items-center 
                gap-x-2 
                text-sm 
            `}
        >
            {error ?
                <ExclamationTriangleIcon className="h-4 w-4" />
                :
                <CheckCircledIcon className="h-4 w-4" />
            }
            <p>{message}</p>
        </div>
    )
}