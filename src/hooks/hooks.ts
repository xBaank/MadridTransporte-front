import {type PaletteMode, useTheme} from "@mui/material";
import {useEffect, useState} from "react";

export const defaultPosition = {lat: 40.4165, lng: -3.70256};

export function useAmberColor() {
  const theme = useTheme();
  return theme.palette.mode === "dark" ? "text-amber-400" : "text-amber-700";
}
export function useRoseColor() {
  const theme = useTheme();
  return theme.palette.mode === "dark" ? "text-red-400" : "text-red-700";
}

export function useBackgroundColor() {
  const theme = useTheme();
  return theme.palette.mode === "dark" ? "bg-gray-800" : "bg-white";
}

export function useSavedTheme(): [PaletteMode, (value: PaletteMode) => void] {
  const loadSavedTheme = () => {
    const defaultTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    let savedTheme = localStorage.getItem("theme") as PaletteMode | null;
    if (savedTheme !== "dark" && savedTheme !== "light") {
      savedTheme = defaultTheme;
    }
    return savedTheme ?? "dark";
  };

  const [theme, setTheme] = useState<PaletteMode>(loadSavedTheme());

  return [
    theme,
    (value: PaletteMode) => {
      setTheme(value);
      localStorage.setItem("theme", value);
    },
  ];
}

export function useMinutesDisplay(): [boolean, (value: boolean) => void] {
  const [display, setDisplay] = useState(
    localStorage.getItem("showInMinutes") === "true",
  );

  useEffect(() => {
    localStorage.setItem("showInMinutes", JSON.stringify(display));
  }, [display]);

  return [display, setDisplay];
}
