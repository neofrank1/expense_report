import { AuthLayout } from "@/components/layout/auth-layout"
import { Card } from "@/components/retroui/Card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/retroui/Input"
import { Label } from "@/components/retroui/Label"
import { Button } from "@/components/retroui/Button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LogintPage() {
    return (
        <AuthLayout>
            <div className="min-w-full flex flex-col items-center justify-center h-full">
                <Card className="p-2 max-w-[60vh] w-full max-h-[90vh]">
                    <div className="flex flex-row justify-center items-center relative">
                        <Link href="/" className="absolute left-0">
                            <Button variant="link" className="p-1">
                                <ArrowLeft className="mr-2"/>
                            </Button>
                        </Link>
                        <Card.Title className="p-1 mt-1">Login</Card.Title>
                    </div>
                    <Separator/>
                    <Card.Content>
                        <div className="grid grid-rows gap-4 p-2">
                            <div className="grid grid-rows gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input placeholder="Enter Email" type="text"/>
                            </div>
                            <div className="grid grid-rows gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input placeholder="Enter password" type="password"/>
                            </div>
                            <Button className="dark:bg-foreground dark:text-background dark:shadow-md dark:shadow-primary dark:hover:shadow-sm w-full flex justify-center">Create Account</Button>
                        </div>
                    </Card.Content>
                    <Separator className="mt-2"/>
                    <Card.Content className="p-2 flex justify-center">
                        <p className="text-sm">No Account yet? <Link href="/register" className="text-primary hover:underline dark:text-foreground">Create an Account</Link></p>
                    </Card.Content>
                </Card>
            </div>
        </AuthLayout>
    )
}