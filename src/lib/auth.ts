import GoogleProvider from "next-auth/providers/google";
import { getUserCollection } from "@/lib/user-collection";
import { type User, type Session } from "next-auth";

// authOptions fica em lib/auth.ts (fora de route.ts)
// porque Next.js 15 só permite exportar handlers HTTP de route.ts
export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }: { user: User }) {
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

    async session({ session }: { session: Session }) {
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
