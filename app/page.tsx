"use client"

import { useState } from "react"
import AudioMixer from "@/components/audio-mixer"
import FocusTimer from "@/components/focus-timer"
import BackgroundSelector from "@/components/background-selector"
import { Leaf } from "lucide-react"
import { cn } from "@/lib/utils"

type BackgroundCategory = "color" | "image" | "pattern"

type BackgroundOption = {
  id: string
  name: string
  value: string
  thumbnail?: string
}

export default function Home() {
  const [background, setBackground] = useState<{
    type: BackgroundCategory
    option: BackgroundOption
  }>({
    type: "color",
    option: {
      id: "forest",
      name: "Forest",
      value: "bg-emerald-700",
    },
  })

  const getBackgroundStyle = () => {
    if (background.type === "color") {
      return { className: background.option.value }
    } else {
      return {
        className: "bg-cover bg-center",
        style: { backgroundImage: background.option.value },
      }
    }
  }

  const bgStyle = getBackgroundStyle()

  return (
    <main
      className={cn("min-h-screen text-stone-800 relative overflow-hidden", bgStyle.className)}
      style={bgStyle.style}
    >
      <div className="relative z-10 p-4">
        <header className="mb-4 flex items-center">
          <div className="flex items-center gap-1">
            <Leaf className="h-4 w-4 text-white" />
            <h1 className="text-lg font-bold text-white">Zen Focus</h1>
          </div>
        </header>
      </div>

      {/* Audio mixer and focus timer are positioned absolutely */}
      <AudioMixer />
      <FocusTimer />
      <BackgroundSelector onSelect={setBackground} />
    </main>
  )
}
