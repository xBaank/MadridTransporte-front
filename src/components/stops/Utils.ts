import {useTheme} from "@mui/material";

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
export function useBorderColor() {
  const theme = useTheme();
  return theme.palette.mode === "dark" ? "border-white" : "border-black";
}

export function getSystemTheme() {
  const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  console.log("Theme: " + theme);
  return theme;
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
