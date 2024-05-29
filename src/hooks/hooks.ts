import {type PaletteMode, useTheme} from "@mui/material";
import {useEffect, useState} from "react";
import {
  initDB,
  getStops,
  getAllApiStops,
  addStops,
} from "../components/stops/api/Stops";

export const defaultPosition = {lat: 40.4165, lng: -3.70256};

export function useColor() {
  const theme = useTheme();
  return theme.palette.mode === "dark" ? "text-white" : "text-black";
}

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

export function changeMinutesDisplay() {
  const showInMinutes = localStorage.getItem("showInMinutes");
  if (showInMinutes === "true") {
    localStorage.setItem("showInMinutes", "false");
  } else {
    localStorage.setItem("showInMinutes", "true");
  }
}

export function getMinutesDisplay() {
  const showInMinutes = localStorage.getItem("showInMinutes");
  if (showInMinutes === "true") {
    return true;
  } else {
    return false;
  }
}

export function useLoadStops(
  onLoad?: () => void,
): [boolean, boolean, boolean, boolean] {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [ready, setReady] = useState(false);

  async function loadStops() {
    const initialized = await initDB("stops");

    if (!initialized) {
      alert("La base de datos no ha podido ser inicializada");
      return;
    }

    const stops = await getStops();

    if (stops?.length === 0) {
      console.log("Loading");
      setOpen(true);

      try {
        getAllApiStops().then(async stops => {
          if (stops._tag !== "Left") {
            await addStops(stops.right, (current, total) => {
              if (current === total) setSuccess(true);
            });

            setTimeout(() => {
              setSuccess(false);
              setOpen(false);
              setReady(true);
              if (onLoad !== undefined) onLoad();
            }, 2000);

            console.log("Finished loading");
          }
        });
      } catch {
        console.error("Error updating stops");
        setError(true);
        setTimeout(() => {
          setError(false);
          setSuccess(false);
          setOpen(false);
          setReady(false);
          if (onLoad !== undefined) onLoad();
        }, 2000);
      }
    }
    if (stops?.length > 0) {
      setReady(true);
    }
  }

  useEffect(() => {
    loadStops();
  }, []);

  return [ready, open, success, error];
}
