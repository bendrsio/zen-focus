"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Clock, Edit, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FocusTimer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isEditingManually, setIsEditingManually] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const notificationSound = useRef<HTMLAudioElement | null>(null);
  const startSound = useRef<HTMLAudioElement | null>(null);

  // Calculate total seconds when hours, minutes, or seconds change
  useEffect(() => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    setTimeLeft(totalSeconds);
    setIsFinished(false);
  }, [hours, minutes, seconds]);

  useEffect(() => {
    notificationSound.current = new Audio("/sounds/stop.mp3");
    startSound.current = new Audio("/sounds/start.mp3");
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsActive(false);
            setIsFinished(true);
            notificationSound.current
              ?.play()
              .catch((err) =>
                console.error("Error playing notification:", err)
              );
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isActive && timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    // play start sound when starting or restarting
    if (!isActive || isFinished) {
      startSound.current
        ?.play()
        .catch((err) => console.error("Error playing start sound:", err));
    }
    if (isFinished) {
      resetTimer();
      setIsActive(true);
    } else {
      setIsActive(!isActive);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(hours * 3600 + minutes * 60 + seconds);
    setIsFinished(false);
  };

  const formatTimeDisplay = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, "0")}:${m
      .toString()
      .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleInputChange = (
    type: "hours" | "minutes" | "seconds",
    value: string
  ) => {
    const numValue = Number.parseInt(value) || 0;

    if (type === "hours") {
      setHours(Math.min(Math.max(numValue, 0), 23));
    } else if (type === "minutes") {
      setMinutes(Math.min(Math.max(numValue, 0), 59));
    } else if (type === "seconds") {
      setSeconds(Math.min(Math.max(numValue, 0), 59));
    }
  };

  const handleSliderChange = (value: number[]) => {
    // Convert slider value (in minutes) to hours, minutes, seconds
    const totalMinutes = value[0];
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;

    setHours(h);
    setMinutes(m);
    setSeconds(0);
  };

  const calculateProgress = () => {
    const total = hours * 3600 + minutes * 60 + seconds;
    if (total === 0) return 0;
    return ((total - timeLeft) / total) * 100;
  };

  // Convert current time to minutes for the slider
  const currentTimeInMinutes = hours * 60 + minutes;

  return (
    <div className="fixed top-4 right-4 z-20">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-amber-100 p-4 w-64">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-emerald-700 flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Focus Timer
          </h2>
          <div className="flex gap-1">
            <Button
              onClick={toggleTimer}
              variant="outline"
              size="icon"
              className={cn(
                "h-6 w-6 rounded-full",
                isActive
                  ? "border-amber-500 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                  : "border-emerald-500 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
              )}
            >
              {isActive ? (
                <Pause className="h-3 w-3" />
              ) : (
                <Play className="h-3 w-3" />
              )}
            </Button>
            <Button
              onClick={resetTimer}
              variant="outline"
              size="icon"
              className="h-6 w-6 rounded-full border-stone-300 text-stone-500 hover:text-stone-700 hover:bg-stone-50"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
            <Button
              onClick={() => setIsEditingManually(!isEditingManually)}
              variant="outline"
              size="icon"
              className="h-6 w-6 rounded-full border-stone-300 text-stone-500 hover:text-stone-700 hover:bg-stone-50"
            >
              {isEditingManually ? (
                <Check className="h-3 w-3" />
              ) : (
                <Edit className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>

        <div className="relative mb-4">
          <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-300",
                isFinished ? "bg-amber-500" : "bg-emerald-500"
              )}
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-4">
          <div
            className={cn(
              "text-2xl font-bold text-center tabular-nums",
              isFinished
                ? "text-amber-600"
                : isActive
                ? "text-emerald-600"
                : "text-stone-600"
            )}
          >
            {formatTimeDisplay(timeLeft)}
          </div>
        </div>

        {!isActive && (
          <>
            {isEditingManually ? (
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-stone-500 block text-center">
                    Hours
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    value={hours}
                    onChange={(e) => handleInputChange("hours", e.target.value)}
                    className="h-8 text-center"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-stone-500 block text-center">
                    Minutes
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) =>
                      handleInputChange("minutes", e.target.value)
                    }
                    className="h-8 text-center"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-stone-500 block text-center">
                    Seconds
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={seconds}
                    onChange={(e) =>
                      handleInputChange("seconds", e.target.value)
                    }
                    className="h-8 text-center"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-stone-500">
                    Duration: {hours > 0 ? `${hours}h ` : ""}
                    {minutes}m
                  </span>
                  <span className="text-xs text-stone-500">
                    {currentTimeInMinutes} min
                  </span>
                </div>
                <Slider
                  value={[currentTimeInMinutes]}
                  min={1}
                  max={180}
                  step={1}
                  onValueChange={handleSliderChange}
                  className={cn(
                    "cursor-pointer",
                    "[&>span:first-child]:h-1",
                    "[&>span:first-child]:bg-emerald-200",
                    "[&_[role=slider]]:h-3",
                    "[&_[role=slider]]:w-3",
                    "[&_[role=slider]]:border",
                    "[&_[role=slider]]:border-emerald-500",
                    "[&_[role=slider]]:bg-white",
                    "[&>span:first-child_span]:bg-emerald-500"
                  )}
                />
                <div className="flex justify-between text-xs text-stone-400">
                  <span>1m</span>
                  <span>1h</span>
                  <span>3h</span>
                </div>
              </div>
            )}
          </>
        )}

        {isFinished && (
          <div className="mt-3 p-2 bg-amber-100 rounded-lg text-amber-800 text-xs text-center">
            Focus session complete!
          </div>
        )}
      </div>
    </div>
  );
}
