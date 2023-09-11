import { useTheme } from "@mui/material";

export default function useColor() {
    const theme = useTheme();
    return theme.palette.mode === 'dark' ? "text-white" : "text-black";
}

export function useBgColor() {
    const theme = useTheme();
    return theme.palette.mode === 'dark' ? "bg-black" : "bg-white";
}

export function useBorderColor() {
    const theme = useTheme();
    return theme.palette.mode === 'dark' ? "border-white" : "border-black";
}