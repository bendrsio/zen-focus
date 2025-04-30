"use client";

import { useState } from "react";
import AudioMixer from "@/components/audio-mixer";
import FocusTimer from "@/components/focus-timer";
import BackgroundSelector from "@/components/background-selector";
import { Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

type BackgroundCategory = "color" | "image" | "pattern";

type BackgroundOption = {
  id: string;
  name: string;
  value: string;
  thumbnail?: string;
};

export default function Home() {
  const [background, setBackground] = useState<{
    type: BackgroundCategory;
    option: BackgroundOption;
  }>({
    type: "color",
    option: {
      id: "forest",
      name: "Forest",
      value: "bg-emerald-700",
    },
  });

  const getBackgroundStyle = () => {
    if (background.type === "color") {
      return { className: background.option.value };
    } else {
      return {
        className: "bg-cover bg-center",
        style: { backgroundImage: background.option.value },
      };
    }
  };

  const bgStyle = getBackgroundStyle();

  return (
    <main
      className={cn(
        "min-h-screen text-stone-800 relative overflow-hidden pb-20",
        bgStyle.className
      )}
      style={bgStyle.style}
    >
      <div className="relative z-10 p-4">
        <header className="mb-4 flex items-center">
          <div className="flex items-center gap-1">
            <Leaf className="h-8 w-8 text-white" />
            <h1 className="text-lg font-bold text-white">Zen Focus</h1>
          </div>
        </header>
      </div>

      {/* Audio mixer and focus timer are positioned absolutely */}
      <AudioMixer />
      <FocusTimer />
      <BackgroundSelector onSelect={setBackground} />

      {/* Footer */}
      <footer className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-white z-10">
        <div className="absolute inset-0 bg-black/20 z-0" />
        <div className="relative z-10">
          <p>
            Zen Focus by{" "}
            <a
              href="https://desprets.net"
              className="underline hover:opacity-80 transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ben Desprets
            </a>
            . All assets belong to their respective owners.
          </p>
        </div>
      </footer>
    </main>
  );
}
