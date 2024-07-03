"use client"

import UserInfo from "@/components/auth/UserInfo"
import { useCurrentUser } from "@/hooks/use-current-user"

const page =() => {
    const user=useCurrentUser()
  return (
    <div>
     <UserInfo user={user || null} label="📱 Client  Component"/>
    </div>
  )
}

export default page
