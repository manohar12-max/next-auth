"use client"

import UserInfo from "@/components/auth/UserInfo"
import useCurrentUser from "@/hooks/useCurrentUser";

const ClientPage =() => {
    const user=useCurrentUser()
  return (
    <div>
     <UserInfo user={user || null} label="📱 Client  Component"/>
    </div>
  )
}

export default ClientPage
