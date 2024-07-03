"use server";

import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { error } from "console";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
//this is backend side
export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validateFields = RegisterSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Invalid Fields" };
  }
  const { email, password, name } = validateFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);
  const existinguser = await getUserByEmail(email);
  if (existinguser) {
    return { error: "Email already exists" };
  }
  await db.user.create({
    data: { name, email, password: hashedPassword },
  });
  const verificationToken = await generateVerificationToken(email);

  await sendVerificationEmail(verificationToken.email, verificationToken.token);
  return { success: "Confirmation Email sent!" };
};
