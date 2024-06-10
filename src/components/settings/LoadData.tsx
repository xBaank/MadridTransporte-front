import LinearProgress from "@mui/material/LinearProgress";
import {Alert, Box, Modal, Typography} from "@mui/material";
import {useContext, useEffect, useState} from "react";
import {getAllApiLines, getAllApiStops} from "../stops/api/Stops";
import {
  DataLoadContext,
  MigrationContext,
} from "../../contexts/dataLoadContext";
import {db} from "../stops/api/Db";
import {
  getFavorites,
  getTrainFavorites,
  deleteAllFavoritesFromLocalStorage,
} from "../stops/api/Utils";

export default function LoadData() {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const loadDataContext = useContext(DataLoadContext);
  const migrationContext = useContext(MigrationContext);

  async function loadStops() {
    const stopsCount = await db.stops.count();
    const linesCount = await db.lines.count();

    if (stopsCount === 0 || linesCount === 0) {
      console.log("Loading");
      setOpen(true);

      try {
        const stopsPromise = getAllApiStops().then(async stops => {
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
              loadDataContext.setDataLoaded(true);
            }, 2000);

            console.log("Finished loading stops");
          }
        });

        const linesPromise = getAllApiLines().then(async lines => {
          if (lines._tag !== "Left") {
            const mapped = lines.right;

            await db.lines.bulkPut(mapped);
            setSuccess(true);

            setTimeout(() => {
              setSuccess(false);
              setOpen(false);
              loadDataContext.setDataLoaded(true);
            }, 2000);

            console.log("Finished loading lines");
          }
        });

        await Promise.all([stopsPromise, linesPromise]);
      } catch {
        console.error("Error updating stops and lines");
        setError(true);
        setSuccess(false);
        loadDataContext.setDataLoaded(false);
      }
    }
    if (stopsCount > 0) {
      loadDataContext.setDataLoaded(true);
    }
  }

  async function migrate() {
    const favorites = getFavorites();
    const trainFavorites = getTrainFavorites();

    try {
      if (favorites.length > 0) {
        await db.favorites.bulkPut(favorites);
      }

      if (trainFavorites.length > 0) {
        await db.trainFavorites.bulkPut(trainFavorites);
      }

      deleteAllFavoritesFromLocalStorage();

      migrationContext.setDataMigrated(true);
    } catch {
      console.error("Error migrating favorites");
      setSuccess(false);
      setError(false);
      migrationContext.setDataMigrated(false);
    }
  }

  useEffect(() => {
    loadStops();
    migrate();
  }, []);

  const style = {
    position: "absolute" as const,
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
          Los datos han sido actualizadas correctamente.
        </Alert>
      );
    }
    if (error) {
      return (
        <Alert className="mb-2" variant="outlined" severity="error">
          Ha habido un error. Reinicia la aplicacion.
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
            Actualizando paradas y lineas
          </Typography>
          <div className=" mt-4">
            <InfoMessage />
          </div>
        </Box>
      </Modal>
    </div>
  );
}
