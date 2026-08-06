import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { UserResponse } from '@/types/user';
import { getUserById } from '@/api/userApi';

interface AuthContextValue {
  user: UserResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userId: number) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// The backend currently has no JWT/token mechanism. Login returns a
// UserResponse directly. We store the userId in localStorage to persist
// the session across page reloads.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUserId = localStorage.getItem('evgo_user_id');
    if (storedUserId) {
      getUserById(Number(storedUserId))
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('evgo_user_id');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (userId: number) => {
    localStorage.setItem('evgo_user_id', String(userId));
    const profile = await getUserById(userId);
    setUser(profile);
  };

  const logout = () => {
    localStorage.removeItem('evgo_user_id');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
