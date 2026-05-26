"use client"

import { useTheme } from "next-themes"

export default function DiscordWidget() {
  const { resolvedTheme } = useTheme()
  const theme = resolvedTheme === "dark" ? "dark" : "light"

  return (
    <iframe
      className="shadow-sm w-100 rounded-1"
      src={`https://discord.com/widget?id=1282025492354170972&theme=${theme}`}
      height="450"
      sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
    />
  )
}
