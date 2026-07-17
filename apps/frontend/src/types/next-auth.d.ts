import NextAuth, { type DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    /**
     * Set by the server-side jwt() callback when token refresh fails.
     * Values: 'BackendAuthFailed' | 'RefreshAccessTokenError'
     * The AuthProvider watches this and forces re-login when it's set.
     */
    error?: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      image?: string | null;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    /** Unix timestamp (ms) when the access token expires — used for proactive refresh */
    accessTokenExpiry?: number;
    /** Error state propagated to session so the frontend can detect and handle it */
    error?: string;
    backendUser?: {
      id: string;
      name: string;
      email: string;
      role: string;
      image?: string | null;
    };
  }
}
