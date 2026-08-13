"use client"

// views/campos/model/use-campos-navigation.ts
import { useState } from "react";

export type ExplorerStep = "farms" | "herds" | "cows";

// maneja la navegacion campo -> rodeo -> vacas compartida entre mobile (3 pasos animados) y desktop (panel lateral)
export function useCamposNavigation() {
  const [selectedFarmId, setSelectedFarmId] = useState<number | null>(null);
  const [selectedHerdId, setSelectedHerdId] = useState<number | null>(null);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const step: ExplorerStep = selectedHerdId !== null ? "cows" : selectedFarmId !== null ? "herds" : "farms";

  function openFarm(farmId: number) {
    setDirection("forward");
    setSelectedFarmId(farmId);
    setSelectedHerdId(null);
  }

  function openHerd(herdId: number) {
    setDirection("forward");
    setSelectedHerdId(herdId);
  }

  function backToFarms() {
    setDirection("back");
    setSelectedFarmId(null);
    setSelectedHerdId(null);
  }

  function backToHerds() {
    setDirection("back");
    setSelectedHerdId(null);
  }

  return { step, selectedFarmId, selectedHerdId, direction, openFarm, openHerd, backToFarms, backToHerds };
}
