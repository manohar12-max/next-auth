"use server"

import { db } from "@/lib/db"
import { SettingsSchema } from "@/schemas"
import * as z from "zod"
import { getUserByEmail, getUserById } from "./user"
import { auth } from "@/auth"
import { generateVerificationToken } from "@/lib/tokens"
import { sendVerificationEmail } from "@/lib/mail"
import bcrypt from "bcryptjs"
export const setting=async(values:z.infer<typeof SettingsSchema>)=>{
const session = await auth()
const user =session?.user
if(!user){
    return {error: "You are not logged in"}
}
const dbUser=await db.user.findUnique({
    where:{
        id:user.id
    }
})
if(!dbUser){
    return {error: "User not found"}
}
if(user.isOAuth){
    values.email=undefined
    values.password =undefined
    values.newPassword =undefined
    values.isTwoFactorEnabled=undefined
}

if(values.email && values.email !== user.email){
    const existingUser =await getUserByEmail(values.email) 
    if(existingUser && existingUser.id !== user.id){
        return {error: "Email already exists"}
    }
    const verificationToken =await generateVerificationToken(values.email)
    await sendVerificationEmail(verificationToken.email, verificationToken.token)
     return { success: "Confirmation Email sent!" }
}


if(values.password && values.newPassword && dbUser.password){
    
    const passwordMatch=await bcrypt.compare(values.password, dbUser.password)

    if(!passwordMatch){
        return {error: "Incorrect Password"}
    }
    const hashedPassword = await bcrypt.hash(values.newPassword, 10)
    values.password = hashedPassword
    values.newPassword = undefined
}




await db.user.update({
    where:{
        id:dbUser.id
    },
    data:{
        ...values
    }
})
return { success: "Settings Updated"}
}