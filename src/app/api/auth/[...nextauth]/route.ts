import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getUserCollection } from "@/lib/user-collection";

console.log("GOOGLE_CLIENT_ID LOADING =", process.env.GOOGLE_CLIENT_ID);

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }: { user: any }) {
      const users = await getUserCollection();

      const existingUser = await users.findOne({ email: user.email });

      if (!existingUser) {
        await users.insertOne({
          email: user.email,
          name: user.name,
          image: user.image,
          displayName: "",
          customImage: "",
        });
      }

      return true;
    },

    async session({ session }: { session: any }) {
      const users = await getUserCollection();

      if (!session?.user?.email) return session;

      const userInDB = await users.findOne({ email: session.user.email });

      if (userInDB) {
        session.user.displayName = userInDB.displayName || userInDB.name;
        session.user.customImage = userInDB.customImage || userInDB.image;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
