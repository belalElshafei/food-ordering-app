import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Client-side localStorage auth is handled in the login page
        // This server-side authorize just validates the token passed from client
        if (!credentials?.email || !credentials?.password) return null;

        // The actual password comparison happens client-side via authUtils
        // Here we trust the client has verified and passes a special token
        const tokenStr = credentials.password as string;
        if (tokenStr.startsWith('VERIFIED:')) {
          const userData = JSON.parse(tokenStr.replace('VERIFIED:', ''));
          return {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            image: userData.image || null,
          };
        }
        return null;
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/en/login',
  },
});
