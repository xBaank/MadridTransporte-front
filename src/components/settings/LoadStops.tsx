import LinearProgress from "@mui/material/LinearProgress";
import {Alert, Box, Modal, Typography} from "@mui/material";

export default function RenderLoadStops({
  open,
  success,
  error,
}: {
  open: boolean;
  success: boolean;
  error: boolean;
}) {
  const style = {
    position: "absolute" as "absolute",
    display: "block",
    height: "80%",
    margin: "auto",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 370,
    bgcolor: "background.paper",
    border: "2px",
    overflow: "scroll",
    borderRadius: "25px",
    boxShadow: 24,
    p: 4,
  };

  function InfoMessage() {
    if (success) {
      return (
        <Alert className="mb-2" variant="outlined" severity="success">
          Las paradas han sido actualizadas correctamente.
        </Alert>
      );
    }
    if (error) {
      return (
        <Alert className="mb-2" variant="outlined" severity="error">
          Ha habido un error al actualizar las paradas.
        </Alert>
      );
    }

    return <LinearProgress className="mb-2" color="success" />;
  }

  return (
    <div className="mt-2">
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="text-center">
            Actualizando paradas
          </Typography>
          <div className=" mt-4">
            <InfoMessage />
          </div>
        </Box>
      </Modal>
    </div>
  );
}
