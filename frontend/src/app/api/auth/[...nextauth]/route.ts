import NextAuth, { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        {
            id: "fablabs",
            name: "Fablabs.io",
            type: "oauth",
            authorization: { url: "https://fablabs.io/oauth/authorize", params: { scope: "public" } },
            token: "https://fablabs.io/oauth/token",
            userinfo: "https://fablabs.io/api/me.json",
            clientId: process.env.FABLABS_CLIENT_ID,
            clientSecret: process.env.FABLABS_CLIENT_SECRET,
            profile(profile) {
                return {
                    id: profile.id.toString(),
                    name: profile.name || profile.username,
                    email: profile.email,
                    image: profile.avatar || null,
                };
            },
        },
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            // @ts-ignore
            session.accessToken = token.accessToken;
            return session;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
