import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from "next-auth/providers/facebook";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import { Resend } from "resend";

const prisma = new PrismaClient();

const resend = new Resend(process.env.RESEND_API_KEY);

const authOptions: any = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        const isValid = await bcrypt.compare(credentials.password, user.password);
        return isValid ? user : null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&re'
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),

    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        // console.log("[email]  when is this executed?")
        await resend.emails.send({
          from: provider.from,
          to: email,
          subject: "Verify your email",
          html: `<p>Click <a href="${url}">here</a> to verify your email address.</p>`,
        });
        // console.log("[email] async?")
      },
     }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ baseUrl }: {baseUrl: string}) {
      return baseUrl + "/dashboard"; // redirect to dashboard after login
    }
  }
}

export default NextAuth(authOptions);
export { authOptions }

// import NextAuth from "next-auth";
// import EmailProvider from "next-auth/providers/email";
// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// const handler = NextAuth({
//   providers: [
//     EmailProvider({
//       server: "", // leave empty when using sendVerificationRequest
//       from: "no-reply@yourdomain.com",
//       sendVerificationRequest: async ({ identifier: email, url, provider }) => {
//         await resend.emails.send({
//           from: provider.from,
//           to: email,
//           subject: "Verify your email",
//           html: `<p>Click <a href="${url}">here</a> to verify your email address.</p>`,
//         });
//       },
//     }),
//   ],
//   pages: {
//     signIn: "/auth/signin", // optional custom pages
//   },
// });

// export { handler as GET, handler as POST };

