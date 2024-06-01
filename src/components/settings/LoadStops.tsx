import LinearProgress from "@mui/material/LinearProgress";
import {Alert, Box, Modal, Typography} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {getAllApiStops} from "../stops/api/stops";
import {DataLoadContext} from "../../contexts/dataLoadContext";
import {db} from "../stops/api/db";

export default function RenderLoadStops() {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const loadDataContext = useContext(DataLoadContext);

  async function loadStops() {
    const stopsCount = await db.stops.count();

    if (stopsCount === 0) {
      console.log("Loading");
      setOpen(true);

      try {
        getAllApiStops().then(async stops => {
          if (stops._tag !== "Left") {
            const mapped = stops.right.map(i => {
              return {
                ...i,
                stopName: i.stopName
                  .normalize("NFD")
                  .replace(/[\u0300-\u036f]/g, ""),
              };
            });

            await db.stops.bulkPut(mapped);
            setSuccess(true);

            setTimeout(() => {
              setSuccess(false);
              setOpen(false);
              loadDataContext.setDataLoaded({loaded: true});
            }, 2000);

            console.log("Finished loading");
          }
        });
      } catch {
        console.error("Error updating stops");
        setError(true);
        setSuccess(false);
        loadDataContext.setDataLoaded({loaded: false});
      }
    }
    if (stopsCount > 0) {
      loadDataContext.setDataLoaded({loaded: true});
    }
  }

  useEffect(() => {
    loadStops();
  }, []);

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
          Ha habido un error al actualizar las paradas. Reinicia la aplicacion.
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
          <div className="text-center font-bold text-sm">
            No cierres la aplicacion
          </div>
          <div className=" mt-4">
            <InfoMessage />
          </div>
        </Box>
      </Modal>
    </div>
  );
}
