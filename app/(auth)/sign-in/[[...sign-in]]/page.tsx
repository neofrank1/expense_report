import { AuthLayout } from "@/components/layout/auth-layout"
import { SignIn } from '@clerk/nextjs'

export default function LogintPage() {
    return (
        <AuthLayout>
            <div className="min-w-full flex flex-col items-center justify-center h-full">
                <SignIn />
            </div>
        </AuthLayout>
    )
}