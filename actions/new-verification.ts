"use server"

import {  getVerificationTokenByToken } from "@/data/verification-token"
import { db } from "@/lib/db"
import { getUserByEmail } from "./user"

export const newVerifications =async(token:string)=>{
   
    const existingToken=await getVerificationTokenByToken(token)
    if(!existingToken){

        return {error: "Verification token not found"};
    }
    const hasExpired=new Date(existingToken.expires)<new Date();
    if(hasExpired){
  
        return {error: "Verification token has expired"};
    }
    // get user to validate
    const existinguser=await getUserByEmail(existingToken.email);

    if(!existinguser){
     
        
       return {error: "Email not found"}; 
    }
    await db.user.update({
        where:{
            id:existinguser.id
        },
        data:{
            emailVerified: new Date(),
            email: existingToken.email
        }
    })
    await db.verificationToken.delete({
        where:{
            id:existingToken.id
        }
    })

    return {success: "Email verified successfully"};
}