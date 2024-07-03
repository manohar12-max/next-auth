import { UserRole } from "@prisma/client";
import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  code:z.optional(z.string())
});

export const RegisterSchema = z.object({
    email: z.string().email({
      message: "Please enter a valid email address."
    }),
    password: z.string().min(6,{
      message: "Password must be at least 6 characters long."
    }),
    name: z.string().min(1,{
      message: "Name is required"
    }),
    
  });

  export const ResetSchema = z.object({
    email: z.string().email(),
    
  });

  export const NewPasswordSchema = z.object({
    password: z.string().min(6,{
      message: "Password must be at least 6 characters long."
    }),
    
  });
  
  
export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled:  z.optional(z.boolean()),
  role:z.enum([UserRole.ADMIN, UserRole.USER]),
  email:z.optional(z.string().email()),
  password: z.optional(z.string().min(6)),
  newPassword:z.optional(z.string().min(6)),
})
