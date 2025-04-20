"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Background category types
type BackgroundCategory = "color" | "image";

// Background option interface
interface BackgroundOption {
  id: string;
  name: string;
  value: string;
  thumbnail?: string;
}

// Background categories with their options
const backgroundOptions: Record<BackgroundCategory, BackgroundOption[]> = {
  color: [
    { id: "forest", name: "Forest", value: "bg-emerald-700" },
    { id: "ocean", name: "Ocean", value: "bg-blue-700" },
    { id: "sunset", name: "Sunset", value: "bg-orange-600" },
    { id: "night", name: "Night", value: "bg-slate-900" },
    { id: "dawn", name: "Dawn", value: "bg-rose-400" },
    { id: "lavender", name: "Lavender", value: "bg-purple-500" },
    { id: "mint", name: "Mint", value: "bg-emerald-400" },
  ],
  image: [
    {
      id: "mountains",
      name: "Mountains",
      value: "url('/backgrounds/mountains.jpg')",
    },
    { id: "forest", name: "Forest", value: "url('/backgrounds/forest.jpg')" },
  ],
};

// Category labels
const categoryLabels: Record<BackgroundCategory, string> = {
  color: "Solid Colors",
  image: "Images",
};

export default function BackgroundSelector({
  onSelect,
}: {
  onSelect: (bg: {
    type: BackgroundCategory;
    option: BackgroundOption;
  }) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentCategory, setCurrentCategory] =
    useState<BackgroundCategory>("color");
  const [currentIndex, setCurrentIndex] = useState<
    Record<BackgroundCategory, number>
  >({
    color: 0,
    image: 0,
  });

  // Get current option based on category and index
  const currentOption =
    backgroundOptions[currentCategory][currentIndex[currentCategory]];

  useEffect(() => {
    onSelect({
      type: currentCategory,
      option: currentOption,
    });
  }, [currentCategory, currentOption]);

  // Navigate to previous option in current category
  const prevOption = () => {
    setCurrentIndex((prev) => {
      const categoryOptions = backgroundOptions[currentCategory];
      const newIndex =
        (prev[currentCategory] - 1 + categoryOptions.length) %
        categoryOptions.length;

      return { ...prev, [currentCategory]: newIndex };
    });
  };

  // Navigate to next option in current category
  const nextOption = () => {
    setCurrentIndex((prev) => {
      const categoryOptions = backgroundOptions[currentCategory];
      const newIndex = (prev[currentCategory] + 1) % categoryOptions.length;

      return { ...prev, [currentCategory]: newIndex };
    });
  };

  // Change category
  const changeCategory = (category: BackgroundCategory) => {
    setCurrentCategory(category);
  };

  return (
    <div className="fixed bottom-4 right-4 z-20">
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md border border-amber-100 p-3">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 p-1 rounded-lg hover:bg-stone-100 w-full"
        >
          {currentCategory === "color" ? (
            <div
              className={cn("w-5 h-5 rounded-full", currentOption.value)}
            ></div>
          ) : (
            <div
              className="w-5 h-5 rounded-full bg-cover bg-center"
              style={{ backgroundImage: currentOption.value }}
            ></div>
          )}
          <span className="text-sm font-medium text-stone-600 flex-1 text-left">
            {currentOption.name}
          </span>
          <ChevronLeft
            className={cn(
              "h-4 w-4 text-stone-400 transition-transform",
              isExpanded ? "rotate-90" : "-rotate-90"
            )}
          />
        </button>

        {isExpanded && (
          <div className="mt-2 pt-2 border-t border-stone-200">
            {/* Category selector */}
            <div className="flex justify-between items-center mb-3">
              {(Object.keys(categoryLabels) as BackgroundCategory[]).map(
                (category) => (
                  <button
                    key={category}
                    onClick={() => changeCategory(category)}
                    className={cn(
                      "text-xs px-2 py-1 rounded-md transition-colors",
                      currentCategory === category
                        ? "bg-emerald-100 text-emerald-700"
                        : "text-stone-500 hover:bg-stone-100"
                    )}
                  >
                    {categoryLabels[category]}
                  </button>
                )
              )}
            </div>

            {/* Option browser */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevOption}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div className="flex-1 text-center">
                {currentCategory === "color" ? (
                  <div className="flex justify-center">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full",
                        currentOption.value
                      )}
                    ></div>
                  </div>
                ) : (
                  <div
                    className="w-16 h-16 mx-auto rounded-md bg-cover bg-center"
                    style={{ backgroundImage: currentOption.value }}
                  ></div>
                )}
                <div className="mt-1 text-sm text-stone-600">
                  {currentOption.name}
                </div>
              </div>

              <button
                onClick={nextOption}
                className="p-1 rounded-full hover:bg-stone-100 text-stone-500"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
