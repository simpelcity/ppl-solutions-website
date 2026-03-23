"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface SidebarContextType {
  isSidebarCollapsed: boolean
  setIsSidebarCollapsed: (value: boolean) => void
  toggleSidebar: () => void
  isMobile: boolean;
  isTablet: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 576
      setIsMobile(mobile)
      if (mobile) {
        setIsSidebarCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    const checkTablet = () => {
      const tablet = window.innerWidth >= 576 && window.innerWidth < 992
      setIsTablet(tablet)
      if (tablet) {
        setIsSidebarCollapsed(true)
      }
    }

    checkTablet()
    window.addEventListener("resize", checkTablet);
    return () => window.removeEventListener("resize", checkTablet);
  }, [])

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  return (
    <SidebarContext.Provider value={{ isSidebarCollapsed, setIsSidebarCollapsed, toggleSidebar, isMobile, isTablet }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}

