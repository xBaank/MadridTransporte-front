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