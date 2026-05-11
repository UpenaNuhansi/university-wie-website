import { createContext, useMemo, useState } from 'react';

export const AuthContext = createContext({
  user: null,
  loading: false,
  setUser: () => {}
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading] = useState(false);

  const value = useMemo(() => ({ user, setUser, loading }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
