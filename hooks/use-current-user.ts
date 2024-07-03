
import { signIn, useSession  } from "next-auth/react"
import { useEffect } from "react";

 export const useCurrentUser=()=>{
   const session= useSession();
 
   useEffect(() => {
     if (session?.data === null) {
       signIn(); // Force sign in to hopefully resolve error
     }
   }, [session]);
   
   if (!session?.data) return null;
    return session.data?.user
 }
