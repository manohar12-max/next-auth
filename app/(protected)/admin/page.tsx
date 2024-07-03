"use client"

import { admin } from "@/actions/admin"
import FormSuccess from "@/components/FormSuccess"
import RoleGate from "@/components/auth/RoleGate"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useCurrentUser } from "@/hooks/use-current-user"
import { UserRole } from "@prisma/client"
import { toast } from "sonner"

const page = () => {

    const session=useCurrentUser()
    const role=session?.role
    
    const onApiRouteClick=()=>{
        fetch("/api/admin").then((response)=>{
            if(response.ok){
                toast.success("Allowed api route")
            }else{
            toast.error("Forbidden api route")
            }
        })
    }
    const serverActionClick=()=>{
        admin().then((data)=>{
            if(data.error){
                toast.error(data.error)
            }else{
                toast.success("Allowed server action")
            }
        })
    }

  return (
    <Card className="w-[600px] shadow-md">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">🔑ADMIN</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole={UserRole.ADMIN}>
            <FormSuccess message="You are allowed to see content" />
        </RoleGate>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
            <p className="text-sm font-medium">
                Admin-only API Route
            </p>
            <Button
             onClick={onApiRouteClick}
            >
                Click to test
            </Button>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
            <p className="text-sm font-medium">
                Admin-only Server Action
            </p>
            <Button
            onClick={serverActionClick}
            >
                Click to test
            </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default page
