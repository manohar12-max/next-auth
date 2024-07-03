"use server"
import bcrypt from "bcryptjs";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { db } from "@/lib/db";
import { NewPasswordSchema } from "@/schemas";
import * as z from "zod"
import { getUserByEmail } from "./user";


export const newPassword=async(values:z.infer<typeof NewPasswordSchema>,token: string | null)=>{
    
  if(!token){
    return {error: "Missing token"}
  }
  const validateFields = NewPasswordSchema.safeParse(values);
  if(!validateFields.success){
    return {error: "Invalid Fields"}
  }
  const {password}=validateFields.data;
  const existingToken=await getPasswordResetTokenByToken(token)

  if(!existingToken){
     return {error: "Invalid Token"}
  }
  const expired=new Date(existingToken.expires) < new Date();
  if(expired){
     return {error: "Verification token has expired"}
  }
  const existingUser=await getUserByEmail(existingToken.email)
  if(!existingUser){
    return {error: "Email not found"}
}
  const hashedPassword=await bcrypt.hash(password,10)
  await db.user.update({
    where:{
      id:existingUser.id
    },data:{
      password:hashedPassword
    }
  })
  await db.passwordResetToken.delete({
    where:{
      id:existingToken.id
    }
  })
  return {success: "Password reset successful"}
}
