import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db";
// import GitHubProvider from "next-auth/providers/github";
// import Auth0Provider from "next-auth/providers/auth0";
import EmailProvider from "next-auth/providers/email";
import { logger } from "~/server/pino";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    EmailProvider({
      server: {
        host: process.env.SMTP_SERVER,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      from: process.env.SMTP_SENDER,
    }),
  ],
  callbacks: {
    async signIn({ user, email }) {
      if (email?.verificationRequest) {
        logger.info(`Verification request by ${user.email}`);
      } else {
        logger.info(`Sign in by ${user.email}`);
      }
      return true;
    },
    async session(params) {
      if (params.user && params.user.emailVerified) {
        params.session.user.emailVerified = params.user.emailVerified as string;
      }
      return params.session;
    },
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/login",
    verifyRequest: "/auth/verify-request"
  },
});
