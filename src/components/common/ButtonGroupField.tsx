import { motion } from "framer-motion"
import { Field, ErrorMessage } from "formik"
import { itemVariants } from "@/lib/utils/motionParams"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip"
import { AlertCircle, Info } from "lucide-react"
import clsx from "clsx"

interface Option {
    label: string
    value: string
}

type Direction = "horizontal" | "vertical" | "wrap"

interface ButtonGroupFieldProps {
    name: string
    label: string
    options: Option[]
    tooltip?: string
    direction?: Direction
}

function ButtonGroupField({
    name,
    label,
    options,
    tooltip,
    direction = "horizontal",
}: ButtonGroupFieldProps) {

    const directionClasses = {
        horizontal: "flex gap-2",
        vertical: "flex flex-col gap-2",
        wrap: "flex flex-wrap gap-2"
    }

    return (
        <motion.div className="space-y-2" variants={itemVariants}>

            {/* Label */}
            <div className="flex items-center gap-2">
                <label className="text-sm font-medium">{label}</label>

                {tooltip && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>

            {/* Buttons */}
            <Field name={name}>
                {({ field, form }: any) => (
                    <div className={directionClasses[direction]}>
                        {options.map((option) => {
                            const active = field.value === option.value

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => form.setFieldValue(name, option.value)}
                                    className={clsx(
                                        "px-3 py-1.5 text-sm rounded-md border transition-all",
                                        "hover:bg-accent hover:text-accent-foreground",
                                        active
                                            ? "bg-primary text-primary-foreground border-primary shadow-sm"
                                            : "bg-background border-border"
                                    )}
                                >
                                    {option.label}
                                </button>
                            )
                        })}
                    </div>
                )}
            </Field>

            {/* Error */}
            <ErrorMessage name={name}>
                {(msg) => (
                    <div className="flex items-center gap-1 text-sm font-medium text-destructive">
                        <AlertCircle className="h-4 w-4" />
                        <p>{msg}</p>
                    </div>
                )}
            </ErrorMessage>

        </motion.div>
    )
}

export default ButtonGroupField