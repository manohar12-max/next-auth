
import { signIn, useSession  } from "next-auth/react"

 function useCurrentUser() {
   const session= useSession();
 
 
     if (session?.data === null) {
       signIn(); // Force sign in to hopefully resolve error
     }
 
   
   if (!session?.data) return null;
      let user =session.data.user;
      return  user
 }

 export default useCurrentUser