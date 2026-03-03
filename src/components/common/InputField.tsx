import { motion } from "framer-motion"
import { itemVariants } from '@/lib/utils/motionParams'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { AlertCircle, Info, Mail } from 'lucide-react'
import { ErrorMessage, Field } from 'formik'
import { Input } from '../ui/input'

interface InputFieldProps {
    name: string
    label: string
    placeholder?: string
    type?: "text" | "password" | "email"
    tooltip?: string
}
function InputField({ name, label, placeholder, type, tooltip }: InputFieldProps) {
    return (
        <motion.div className="space-y-1" variants={itemVariants}>
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
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input id={name} placeholder={placeholder} className="pl-10" type={type} {...field} />
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