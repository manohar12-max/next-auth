
import { auth } from "@/auth"
import UserInfo from "@/components/auth/UserInfo"

const page = async() => {
    const session=await auth()
  return (
    <div>
     <UserInfo user={session?.user} label="🖥️ Server  Component"/>
    </div>
  )
}

export default page
