'use client';

import { createContext, useEffect, useState } from 'react';
import { useSession, signOut as betterAuthSignOut } from '@/lib/auth-client';
import axios from 'axios';

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const { data: session, isPending } = useSession();
  const [jwtReady, setJwtReady] = useState(false);

  useEffect(() => {
    const syncJwt = async () => {
      if (session?.user?.email) {
        // 1. Save user to our own DB (no-op if already exists)
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        });

        // 2. Get our own JWT issued as an HTTPOnly cookie
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/jwt`,
          { email: session.user.email },
          { withCredentials: true }
        );
        setJwtReady(true);
      } else {
        setJwtReady(false);
      }
    };

    if (!isPending) {
      syncJwt();
    }
  }, [session, isPending]);

  const logOut = async () => {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
      {},
      { withCredentials: true }
    );
    await betterAuthSignOut();
  };

  const authInfo = {
    user: session?.user || null,
    loading: isPending || (session?.user && !jwtReady),
    logOut,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
}
