"use client"

import { useState } from "react"
import { Formik, Form } from "formik"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useAuthStore } from "@/store/useAuthStore"
import { LoginSchema } from "@/schemas/LoginSchema"
import { formVariants, itemVariants } from "@/lib/utils/motionParams"
import { useNavigate } from "react-router-dom"
import InputField from "../common/InputField"

export function LoginForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const { login } = useAuthStore()
    const handleSubmit = async (values: { email: string; password: string }) => {
        setIsLoading(true)
        try {
            if (await login(values.email, values.password))
                navigate("/dashboard")
        } catch (error) {
            toast.error("Login error", {
                description: "Incorrect credentials. Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <motion.div
            className="rounded-lg border bg-card text-card-foreground shadow-sm p-6"
            initial="hidden"
            animate="visible"
            variants={formVariants}
        >
            <motion.div className="flex items-center justify-center mb-6" variants={itemVariants}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <img
                        src="/logo.png"
                        alt="Logo"
                        width={50}
                        height={50}
                        className="mx-auto"
                    />
                </motion.div>
            </motion.div>
            <Formik initialValues={{ email: "", password: "" }} validationSchema={LoginSchema} onSubmit={handleSubmit}>
                <Form className="space-y-4">
                    <InputField type="email" label="Email" name="email" placeholder="email@gmail.com" tooltip="Enter an email" />
                    <InputField label="Password" name="password" type={showPassword ? "text" : "password"} placeholder="******" tooltip="Minimum 6 characters" />
                    <motion.div variants={itemVariants}>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isLoading}
                        >
                            {isLoading ? "Logging in..." : "Log in"}
                        </Button>
                    </motion.div>
                    <motion.div className="text-end text-sm" variants={itemVariants}>
                        <p>

                            <a href="/forgotPassword" className="text-primary hover:text-primary/90 hover:underline">
                                Forgot your password?
                            </a>
                        </p>
                    </motion.div>
                    <motion.div className="text-center text-sm" variants={itemVariants}>
                        <p>
                            Don't have an account?{" "}
                            <a href="/register" className="text-primary hover:text-primary/90 hover:underline">
                                Register here
                            </a>
                        </p>
                    </motion.div>
                </Form>
            </Formik>
        </motion.div>
    )
}