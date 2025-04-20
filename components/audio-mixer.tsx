"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import {
  ChevronLeft,
  ChevronRight,
  Volume2,
  Cloud,
  CloudRain,
  Wind,
  Waves,
  Flame,
  Bird,
  Trees,
  Zap,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// props for draggable sound block

type SoundBlockProps = {
  sound: SoundOption;
  isInDrawer?: boolean;
  index?: number | null;
};

// props for droppable sound slot
type SoundSlotProps = {
  index: number;
  slot: SoundSlot;
  onRemove: (index: number) => void;
  onVolumeChange: (index: number, value: number[]) => void;
  onToggle: (index: number) => void;
  onDrop: (
    toIndex: number,
    sound: SoundOption,
    fromIndex: number | null
  ) => void;
};

type SoundOption = {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  src: string;
};

type SoundSlot = {
  selectedSound: SoundOption | null;
  volume: number;
  active: boolean;
};

const soundOptions: SoundOption[] = [
  {
    id: "rain",
    name: "Rain",
    icon: <CloudRain className="h-5 w-5" />,
    color: "bg-blue-100 border-blue-300 text-blue-700",
    src: "/sounds/rain.mp3",
  },
  {
    id: "thunder",
    name: "Thunder",
    icon: <Zap className="h-5 w-5" />,
    color: "bg-yellow-100 border-yellow-300 text-yellow-700",
    src: "/sounds/thunder.mp3",
  },
  {
    id: "wind",
    name: "Wind",
    icon: <Wind className="h-5 w-5" />,
    color: "bg-purple-100 border-purple-300 text-purple-700",
    src: "/sounds/wind.mp3",
  },
  {
    id: "water",
    name: "Water",
    icon: <Waves className="h-5 w-5" />,
    color: "bg-cyan-100 border-cyan-300 text-cyan-700",
    src: "/sounds/water.mp3",
  },
  {
    id: "fire",
    name: "Fire",
    icon: <Flame className="h-5 w-5" />,
    color: "bg-orange-100 border-orange-300 text-orange-700",
    src: "/sounds/fire.mp3",
  },
  // {
  //   id: "birds",
  //   name: "Birds",
  //   icon: <Bird className="h-5 w-5" />,
  //   color: "bg-yellow-100 border-yellow-300 text-yellow-700",
  //   src: "/sounds/birds.mp3",
  // },
  // {
  //   id: "forest",
  //   name: "Forest",
  //   icon: <Trees className="h-5 w-5" />,
  //   color: "bg-green-100 border-green-300 text-green-700",
  //   src: "/sounds/forest.mp3",
  // },
];

// Find sound by ID
const findSoundById = (id: string): SoundOption | undefined => {
  return soundOptions.find((sound) => sound.id === id);
};

// Sound block component that can be dragged
const SoundBlock: React.FC<SoundBlockProps> = ({
  sound,
  isInDrawer = true,
  index = null,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "sound",
    item: { sound, fromIndex: index },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={(el) => {
        drag(el);
      }}
      className={cn(
        "flex items-center justify-center p-2 rounded-lg cursor-grab active:cursor-grabbing transition-all",
        sound.color,
        isDragging ? "opacity-50" : "opacity-100",
        isInDrawer ? "w-12 h-12" : "w-14 h-14"
      )}
      style={{ touchAction: "none" }}
    >
      {sound.icon}
    </div>
  );
};

// Sound slot that can receive dragged sound blocks
const SoundSlot: React.FC<SoundSlotProps> = ({
  index,
  slot,
  onRemove,
  onVolumeChange,
  onToggle,
  onDrop,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "sound",
    drop: (item: { sound: SoundOption; fromIndex: number | null }) => {
      onDrop(index, item.sound, item.fromIndex);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div className="flex flex-col items-center gap-2 w-16">
      {/* Sound slot */}
      <div
        ref={(el) => {
          drop(el);
        }}
        className={cn(
          "w-16 h-16 rounded-lg border-2 border-dashed transition-all flex items-center justify-center",
          isOver
            ? "border-emerald-400 bg-emerald-50"
            : "border-stone-300 bg-stone-50",
          slot.selectedSound ? "border-solid" : "border-dashed"
        )}
      >
        {slot.selectedSound ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <SoundBlock
              sound={slot.selectedSound}
              isInDrawer={false}
              index={index}
            />
            <button
              onClick={() => onRemove(index)}
              className="absolute -top-2 -right-2 bg-white rounded-full p-0.5 shadow-sm border border-stone-200 hover:bg-stone-100"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="text-stone-400 text-xs">Drop here</div>
        )}
      </div>
      {/* Sound name */}
      {slot.selectedSound && (
        <div className="text-s text-stone-500">{slot.selectedSound.name}</div>
      )}
      {/* Volume slider above the slot */}
      {slot.selectedSound && (
        <div className="w-full flex flex-col items-center mb-1">
          <Slider
            orientation="horizontal"
            value={[slot.volume]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => onVolumeChange(index, value)}
            className={cn(
              "h-full cursor-pointer",
              "[&>span:first-child]:w-1.5",
              "[&>span:first-child]:bg-emerald-200",
              "[&_[role=slider]]:h-3",
              "[&_[role=slider]]:w-3",
              "[&_[role=slider]]:border",
              "[&_[role=slider]]:border-emerald-500",
              "[&_[role=slider]]:bg-white",
              "[&>span:first-child_span]:bg-emerald-500"
            )}
          />
        </div>
      )}

      {/* Toggle button below the slot */}
      {/* {slot.selectedSound && (
        <button
          onClick={() => onToggle(index)}
          className={cn(
            "w-4 h-4 rounded-full transition-colors",
            slot.active ? "bg-emerald-500" : "bg-stone-300"
          )}
        />
      )} */}
    </div>
  );
};

export default function AudioMixer() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true); // Drawer open by default
  const [globalVolume, setGlobalVolume] = useState(100);
  const [slots, setSlots] = useState<SoundSlot[]>([
    { selectedSound: null, volume: 80, active: false },
    { selectedSound: null, volume: 80, active: false },
    { selectedSound: null, volume: 80, active: false },
    { selectedSound: null, volume: 80, active: false },
    { selectedSound: null, volume: 80, active: false },
  ]);

  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});
  const initialized = useRef(false);

  // Get available sounds (not currently in slots)
  const getAvailableSounds = () => {
    const usedSoundIds = slots
      .filter((slot) => slot.selectedSound !== null)
      .map((slot) => slot.selectedSound!.id);

    return soundOptions.filter((sound) => !usedSoundIds.includes(sound.id));
  };

  // Initialize with default sounds (rain and thunder)
  useEffect(() => {
    if (!initialized.current) {
      // const rainSound = findSoundById("rain");
      // const thunderSound = findSoundById("thunder");

      // if (rainSound && thunderSound) {
      //   setSlots((prev) => {
      //     const newSlots = [...prev];
      //     newSlots[0] = { selectedSound: rainSound, volume: 70, active: true };
      //     newSlots[1] = {
      //       selectedSound: thunderSound,
      //       volume: 60,
      //       active: true,
      //     };
      //     return newSlots;
      //   });
      // }

      initialized.current = true;
    }
  }, []);

  useEffect(() => {
    // Initialize audio elements for all sound options
    soundOptions.forEach((sound) => {
      if (!audioRefs.current[sound.id]) {
        const audio = new Audio(sound.src);
        audio.loop = true;
        audioRefs.current[sound.id] = audio;
      }
    });

    // Cleanup function
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  useEffect(() => {
    // Update audio playback and volume based on slots state and global volume
    slots.forEach((slot) => {
      if (!slot.selectedSound) return;

      const audio = audioRefs.current[slot.selectedSound.id];
      if (!audio) return;

      if (slot.active) {
        if (audio.paused) {
          audio
            .play()
            .catch((err) => console.error("Error playing audio:", err));
        }
        // Apply both slot volume and global volume
        audio.volume = (slot.volume / 100) * (globalVolume / 100);
      } else {
        audio.pause();
      }
    });
  }, [slots, globalVolume]);

  const toggleSlot = (index: number) => {
    setSlots((prev) =>
      prev.map((slot, i) =>
        i === index ? { ...slot, active: !slot.active } : slot
      )
    );
  };

  const updateSlotVolume = (index: number, value: number[]) => {
    setSlots((prev) =>
      prev.map((slot, i) =>
        i === index ? { ...slot, volume: value[0] } : slot
      )
    );
  };

  const removeSound = (index: number) => {
    setSlots((prev) => {
      const newSlots = [...prev];
      if (newSlots[index].selectedSound) {
        const audio = audioRefs.current[newSlots[index].selectedSound!.id];
        if (audio) {
          audio.pause();
        }
      }
      newSlots[index] = { selectedSound: null, volume: 70, active: false };
      return newSlots;
    });
  };

  const handleDrop = (
    toIndex: number,
    sound: SoundOption,
    fromIndex: number | null
  ) => {
    setSlots((prev) => {
      const newSlots = [...prev];

      // If coming from another slot (swapping)
      if (fromIndex !== null) {
        // Store the sound that was in the target slot (if any)
        const targetSound = newSlots[toIndex].selectedSound;

        // Move sound from source slot to target slot
        newSlots[toIndex] = {
          selectedSound: sound,
          volume: newSlots[toIndex].volume,
          active: true,
        };

        // Clear the source slot or place the target sound there (swap)
        newSlots[fromIndex] = {
          selectedSound: targetSound,
          volume: newSlots[fromIndex].volume,
          active: targetSound ? true : false,
        };
      }
      // If coming from the drawer (new sound)
      else {
        // If there was a sound in the slot, pause it
        if (newSlots[toIndex].selectedSound) {
          const audio = audioRefs.current[newSlots[toIndex].selectedSound!.id];
          if (audio) {
            audio.pause();
          }
        }

        // Place the new sound in the slot
        newSlots[toIndex] = {
          selectedSound: sound,
          volume: newSlots[toIndex].volume,
          active: true,
        };
      }

      return newSlots;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="fixed bottom-4 left-4 z-20">
        <div
          className={cn(
            "bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-amber-100 transition-all duration-500 ease-in-out",
            isExpanded ? "p-4 w-auto" : "p-2 w-12"
          )}
        >
          <div className="flex items-center justify-between mb-3">
            {isExpanded && (
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-medium text-emerald-700">
                  Sound Mixer
                </h2>
                <button
                  onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                  className={cn(
                    "text-xs px-2 py-0.5 rounded transition-colors",
                    isDrawerOpen
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  )}
                >
                  {isDrawerOpen ? "Close Drawer" : "Open Drawer"}
                </button>
              </div>
            )}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-full hover:bg-stone-100 text-stone-500"
            >
              {isExpanded ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </div>

          {isExpanded ? (
            <div className="flex">
              <div className="flex-1">
                {/* Sound slots with volume sliders */}
                <div className="flex gap-3">
                  {slots.map((slot, index) => (
                    <SoundSlot
                      key={index}
                      index={index}
                      slot={slot}
                      onRemove={removeSound}
                      onVolumeChange={updateSlotVolume}
                      onToggle={toggleSlot}
                      onDrop={handleDrop}
                    />
                  ))}
                </div>

                {/* Sound drawer */}
                {isDrawerOpen && (
                  <div className="mt-4 pt-3 border-t border-stone-200">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {getAvailableSounds().map((sound) => (
                        <SoundBlock key={sound.id} sound={sound} />
                      ))}
                      {getAvailableSounds().length === 0 && (
                        <div className="text-xs text-stone-400 py-2">
                          All sounds are in use
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Vertical global volume slider on the right */}
              <div className="flex flex-col items-center">
                <div className="h-24 mb-1">
                  <Slider
                    orientation="vertical"
                    value={[globalVolume]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => setGlobalVolume(value[0])}
                    className={cn(
                      "h-full w-1.5 flex-col", // root
                      "[&>span:first-child]:bg-emerald-200",
                      "[&_[role=slider]]:h-3",
                      "[&_[role=slider]]:w-3",
                      "[&_[role=slider]]:border",
                      "[&_[role=slider]]:border-emerald-500",
                      "[&_[role=slider]]:bg-white"
                    )}
                  />
                </div>
                <Volume2 className="h-4 w-4 text-stone-500" />
                <span className="mt-1 text-s text-stone-500 w-8 text-center flex-shrink-0">
                  {globalVolume}%
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Volume2 className="h-4 w-4 text-stone-500" />
              <div className="h-24">
                <Slider
                  orientation="vertical"
                  value={[globalVolume]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={(value) => setGlobalVolume(value[0])}
                  className={cn(
                    "h-full w-1.5 flex-col", // root
                    "[&>span:first-child]:bg-emerald-200",
                    "[&_[role=slider]]:h-3",
                    "[&_[role=slider]]:w-3",
                    "[&_[role=slider]]:border",
                    "[&_[role=slider]]:border-emerald-500",
                    "[&_[role=slider]]:bg-white"
                  )}
                />
              </div>
              <span className="text-s text-stone-500">{globalVolume}%</span>
            </div>
          )}
        </div>
      </div>
    </DndProvider>
  );
}
