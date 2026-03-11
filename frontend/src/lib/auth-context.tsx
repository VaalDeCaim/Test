"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { MockUser } from "./mock-data";

type User = MockUser | null;

type UserContextValue = {
  user: User;
  loading: boolean;
  logout: () => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

type UserProviderProps = {
  initialUser: User;
  children: ReactNode;
};

export function UserProvider({ initialUser, children }: UserProviderProps) {
  const [user, setUser] = useState<User>(initialUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
    setUser(initialUser);
  }, [initialUser]);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return ctx;
}

