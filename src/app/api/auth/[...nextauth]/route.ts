import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

console.log("GOOGLE_CLIENT_ID LOADING =", process.env.GOOGLE_CLIENT_ID);

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
