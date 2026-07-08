import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID || process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET || process.env.AUTH_GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // First time user signs in via GitHub
      if (account && account.provider === 'github' && profile) {
        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
          const res = await fetch(`${backendUrl}/api/auth/github`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-shared-secret': process.env.AUTH_SHARED_SECRET || '',
            },
            body: JSON.stringify({
              githubId: profile.id?.toString() || user?.id,
              email: profile.email || user?.email,
              name: profile.name || profile.login || user?.name || 'GitHub User',
              image: profile.avatar_url || user?.image || null,
            }),
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error?.message || 'Backend authentication failed');
          }

          const payload = await res.json();
          if (payload.success && payload.data) {
            token.accessToken = payload.data.accessToken;
            token.refreshToken = payload.data.refreshToken;
            token.backendUser = payload.data.user;
          }
        } catch (error) {
          console.error('Error authenticating with backend via GitHub:', error);
        }
      }

      // First time user signs in via Google
      if (account && account.provider === 'google' && profile) {
        try {
          const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
          const res = await fetch(`${backendUrl}/api/auth/google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-auth-shared-secret': process.env.AUTH_SHARED_SECRET || '',
            },
            body: JSON.stringify({
              googleId: profile.sub || user?.id,
              email: profile.email || user?.email,
              name: profile.name || user?.name || 'Google User',
              image: profile.picture || user?.image || null,
            }),
          });

          if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error?.message || 'Backend authentication failed');
          }

          const payload = await res.json();
          if (payload.success && payload.data) {
            token.accessToken = payload.data.accessToken;
            token.refreshToken = payload.data.refreshToken;
            token.backendUser = payload.data.user;
          }
        } catch (error) {
          console.error('Error authenticating with backend via Google:', error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token.accessToken && token.backendUser) {
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string | undefined;
        session.user = {
          ...session.user,
          ...(token.backendUser as any),
        };
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
});
