"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { supabase } from "./supabaseClient"
import { Session, User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  logout: (() => Promise<void>) | null
  refreshSession: (() => Promise<void>) | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  logout: null,
  refreshSession: null,
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
  }

  const refreshSession = async () => {
    const { data } = await supabase.auth.refreshSession();
    setSession(data.session);
    setUser(data.session?.user ?? null);
    setLoading(false);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return <AuthContext.Provider value={{ user, session, loading, logout, refreshSession }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
