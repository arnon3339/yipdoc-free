// import { connectMongoDB } from "@/lib/mongodb";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import poolQuery from "@/lib/pgconnect";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},

      async authorize(credentials) {
        const { name, password } = credentials;
        
        try {
          const textQuery = `
          SELECT name::text, password::text, role::text
          FROM users
          WHERE name = $1;
          `
          const result = await poolQuery(textQuery, [name.toLowerCase()])
          const user = result.rows[0]
          
          if (!user) {
            return null;
          }
          
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) {
            return null;
          }
          return user;
        } catch (error) {
          console.log("Error: ", error);
        }
      },
    }),
  ],
  callbacks: 
  {
    jwt: ({ token, user }) => {
      if (user) {
        token.user = {
          id: user.id,
          name: user.name,
          role: user.role
        }
      }
       // Here, check the token validity date
      // if (token.tokenExpiration < Date.now()) {
        // Call the endpoint where you handle the token refresh for a user
        // const user =  axios.post(
          // `${process.env.API_URL}/auth/authentication/refresh`,
          // {
            // refreshToken: token.refreshToken,
          // }
        // );
        // Check for the result and update the data accordingly
        // return { ...token, ...user };
      // }
      return token;
    },
    session: ({ session, token }) => {
      if (token) {
        session.user = token.user;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
