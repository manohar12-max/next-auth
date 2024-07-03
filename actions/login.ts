"use server";

import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import * as z from "zod";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { db } from "@/lib/db";
import { sendVerificationEmail, sentTwoFactorTokenEmail } from "@/lib/mail";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
//this is backend side
export const login = async (
  values: z.infer<typeof LoginSchema>,
  callbackUrl?: string | null
) => {
  const validateFields = LoginSchema.safeParse(values);
  if (!validateFields.success) {
    return { error: "Invalid Fields" };
  }
  const { email, password, code } = validateFields.data;
  const existinguser = await db.user.findUnique({
    where: { email },
  });
  if (!existinguser || !existinguser.email) {
    return { error: "Invalid Credentials" };
  }
  const valid = bcrypt.compare(password, existinguser.password as string);
  if (!valid) {
    return { error: "Invalid Password" };
  }
  if (!existinguser.emailVerified) {
    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return { success: "Confirmation email sent" };
  }

  //2nd factor authentication
  if (existinguser.isTwoFactorEnabled && existinguser.email) {
    if (code) {
      //verify code
      const twoFactorToken = await getTwoFactorTokenByEmail(existinguser.email);

      if (!twoFactorToken) {
        return { error: "Invalid twoFactor code" };
      }
      if (twoFactorToken.token !== code.toString()) {
        return { error: "Invalid twoFactor code" };
      }
      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) {
        return { error: "Verification token has expired" };
      }
      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });
      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existinguser.id
      );
      if (existingConfirmation) {
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }
      await db.twoFactorConfirmation.create({
        data: {
          userId: existinguser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existinguser.email);
      await sentTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid Credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    throw error;
  }
};
