import {useEffect, useState} from "react";
import LinearProgress from "@mui/material/LinearProgress";
import {Alert} from "@mui/material";

export default function RenderLoadStops({progress}: {progress: number}) {
  const [open, setOpen] = useState(true);
  const [sucess, setSucess] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    console.log(progress);
    if (progress >= 100) {
      setSucess(true);
      setTimeout(() => {
        setSucess(false);
      }, 3000);
    }

    if (progress >= 100 || progress <= 0) handleClose();
    else handleOpen();
  }, [progress]);

  if (sucess) {
    return (
      <Alert className="mb-2" variant="outlined" severity="success">
        Las paradas han sido actualizadas correctamente.
      </Alert>
    );
  }

  if (!open) return null;

  return (
    <LinearProgress className="mb-2" variant="determinate" value={progress} />
  );
}
