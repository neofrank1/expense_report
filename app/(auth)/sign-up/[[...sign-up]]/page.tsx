import { AuthLayout } from "@/components/layout/auth-layout"
import { SignUp } from '@clerk/nextjs'

export default function RegisterPage() {
    return (
        <AuthLayout>
            <div className="min-w-full flex flex-col items-center justify-center h-full">
                <SignUp />
            </div>
        </AuthLayout>
    )
}