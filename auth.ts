import NextAuth, { DefaultSession, User } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { db } from "./lib/db";
import { getUserById } from "./actions/user";
import { UserRole } from "@prisma/client";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./lib/account";
export const { auth, handlers, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // allow o suth without emailverification
      if (account?.provider != "credentials") {
        return true;
      }
      // verify email before allowing login
      const existinguser = await getUserById(user.id as string);
      if (!existinguser?.emailVerified) {
        return false;
      }

      if (existinguser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existinguser.id
        );
        if (!twoFactorConfirmation) {
          return false;
        }
        //Delete two factor confirmation for next sign in
        await db.twoFactorConfirmation.delete({
          where: {
            userId: existinguser.id,
          },
        });
      }
      return true;
    },

    async session({ token, session }) {
      if (token.sub && session.user) {
        //then put id in session
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (session.user && token.isTwoFactorEnabled !== undefined) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }
      if(session.user && token.isOAuth != undefined) {
        
        session.user.isOAuth=token?.isOAuth as boolean;
      }
       
      if(session.user ){
        session.user.name=token.name;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }
      const existinguser = await getUserById(token.sub);
      if (!existinguser) {
        return token;
      }
      const existingAccount=await getAccountByUserId(existinguser.id);
      token.isOAuth=!!existingAccount
      token.name = existinguser.name;
      token.email = existinguser.email;
      token.role = existinguser.role;
      token.isTwoFactorEnabled = existinguser.isTwoFactorEnabled;
      
      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
