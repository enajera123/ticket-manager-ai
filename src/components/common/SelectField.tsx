import { motion } from "framer-motion"
import { itemVariants } from '@/lib/utils/motionParams'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { AlertCircle, Info } from 'lucide-react'
import { ErrorMessage, Field } from 'formik'

interface Option {
    label: string
    value: string
}

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    name: string
    label: string
    options: Option[]
    placeholder?: string
    tooltip?: string
    icon?: React.ReactNode
}

function SelectField({
    name,
    label,
    options,
    placeholder = "Select an option",
    tooltip,
    icon,
    ...props
}: SelectFieldProps) {
    return (
        <motion.div className="space-y-1" variants={itemVariants}>

            <div className="flex items-center gap-2">
                <label htmlFor={name} className="text-sm font-medium">
                    {label}
                </label>

                {tooltip && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Info className="h-4 w-4 text-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p className="text-background">{tooltip}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}
            </div>

            <div className="relative">
                <Field name={name}>
                    {({ field }: { field: any }) => (
                        <div className="relative">

                            {icon && (
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">
                                    {icon}
                                </span>
                            )}

                            <select
                                id={name}
                                {...field}
                                {...props}
                                className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm 
                ${icon ? "pl-10" : ""}
                focus:outline-none focus:ring-2 focus:ring-ring`}
                            >
                                <option value="" disabled>
                                    {placeholder}
                                </option>

                                {options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                        </div>
                    )}
                </Field>

                <ErrorMessage name={name}>
                    {(msg) => (
                        <div className="flex items-center gap-1 mt-1 text-sm font-medium text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            <p className="text-destructive">{msg}</p>
                        </div>
                    )}
                </ErrorMessage>
            </div>

        </motion.div>
    )
}

export default SelectField