import {Box, CircularProgress} from "@mui/material";

export default function LoadingSpinner() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        minHeight: 160,
        p: 4,
      }}>
      <CircularProgress thickness={4} size={40} />
    </Box>
  );
}
