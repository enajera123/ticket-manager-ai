import { motion } from "framer-motion"
import { itemVariants } from '@/lib/utils/motionParams'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { AlertCircle, Info } from 'lucide-react'
import { ErrorMessage, Field } from 'formik'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name: string
    label: string
    placeholder?: string
    type?: "text" | "password" | "email" | "number" | "date"
    tooltip?: string
    icon?: React.ReactNode
    multiline?: boolean
}
function InputField({ name, label, placeholder, type = "text", tooltip, multiline = false, icon, ...props }: InputFieldProps) {
    const combinedClass = [
        !multiline && icon ? "pl-10" : "",
        props.className
    ].join(" ")
    return (
        <motion.div className="space-y-2" variants={itemVariants}>
            <div className="flex items-center gap-2">
                <label htmlFor={name} className="text-sm font-medium">
                    {label}
                </label>
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
            </div>
            <div className="relative">
                <Field name={name}>
                    {({ field }: { field: any }) => (
                        <div className="relative">
                            {!multiline &&
                                icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground">{icon}</span>
                            }
                            {!multiline ? (
                                <Input id={name} placeholder={placeholder} className={combinedClass} type={type} {...field} {...props} />
                            ) : (
                                <Textarea id={name} placeholder={placeholder} className={combinedClass} {...field} {...props} />
                            )}
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
        </motion.div>)
}

export default InputField