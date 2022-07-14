import NextAuth from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db";
// import GitHubProvider from "next-auth/providers/github";
import Auth0Provider from "next-auth/providers/auth0";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // GitHubProvider({
    //   clientId: process.env.GITHUB_CLIENT_ID,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET,
    // }),
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID as string,
      clientSecret: process.env.AUTH0_CLIENT_SECRET as string,
      issuer: process.env.AUTH0_ISSUER,
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  // callbacks: {
  //   session: async ({session, user}) => {
  //     session.dailyUploads = await prisma.user.findUnique({where:{id: user.id}, select: {dailyUploads: true}})
  //     return session
  //   }
  // }
});
