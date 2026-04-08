import ErrorIcon from "@mui/icons-material/Error";
import {Box, Typography} from "@mui/material";

export default function ErrorMessage({message}: {message: string}) {
  return (
    <Box
      sx={{
        m: "auto",
        my: 4,
        mx: 2,
        maxWidth: 420,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 1.5,
        p: 3,
        borderRadius: 3,
        bgcolor: theme =>
          theme.palette.mode === "dark"
            ? "rgba(251, 113, 133, 0.10)"
            : "rgba(225, 29, 72, 0.06)",
        border: "1px solid",
        borderColor: theme =>
          theme.palette.mode === "dark"
            ? "rgba(251, 113, 133, 0.30)"
            : "rgba(225, 29, 72, 0.20)",
      }}>
      <ErrorIcon sx={{color: "error.main", fontSize: 40}} />
      <Typography
        variant="subtitle1"
        sx={{color: "error.main", fontWeight: 700}}>
        {message}
      </Typography>
    </Box>
  );
}
