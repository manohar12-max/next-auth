"use server";

import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { ResetSchema } from "@/schemas";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { getUserByEmail } from "./user";

import { sentPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validateFields = ResetSchema.safeParse(values);
  if (!validateFields.success) return { error: "Invalid email" };
  const { email } = validateFields.data;
  const existinguser = await getUserByEmail(email);
  if (!existinguser) {
    return { error: "Email not found" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sentPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );
  return { success: "Reset password email sent" };
};
