"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { LoaderSpinner } from '@/components'
import type { Dictionary } from "@/app/i18n"
import { type Locale } from "@/i18n"

interface SidebarContextType {
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (value: boolean) => void;
  toggleSidebar: () => void;
  isMobile: boolean;
  showOffcanvas: boolean;
  setShowOffcanvas: (value: boolean) => void;
}

interface Props {
  dict: Dictionary;
  lang: Locale;
  children: React.ReactNode;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children, dict }: Props) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 992
      setIsMobile(mobile)
      setIsSidebarCollapsed(mobile)
      setIsReady(true)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  const toggleSidebar = () => {
    if (isMobile) {
      setShowOffcanvas(true);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  }

  if (!isReady) return <LoaderSpinner dict={dict} />;

  return (
    <SidebarContext.Provider value={{ isSidebarCollapsed, setIsSidebarCollapsed, toggleSidebar, isMobile, showOffcanvas, setShowOffcanvas }}>
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

