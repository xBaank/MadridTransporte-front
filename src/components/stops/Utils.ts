import { useTheme } from "@mui/material";

export default function useColor() {
    const theme = useTheme();
    return theme.palette.mode === 'dark' ? "text-white" : "text-black";
}

export function useBorderColor() {
    const theme = useTheme();
    return theme.palette.mode === 'dark' ? "border-white" : "border-black";
}

export function getSystemTheme() {
    const theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
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

export function formatTime(time: number) {
    if (!getMinutesDisplay()) return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const minutes = Math.floor((time - Date.now()) / 60000);
    if (minutes > 60) return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return minutes + " min";
}