import {Modal, Box, Typography, useTheme} from "@mui/material";
import {type Alert, type Incident} from "./api/Types";
import React from "react";
import {Link} from "react-router-dom";

export default function RenderAlerts({
  alerts,
  incidents,
}: {
  alerts: Alert[];
  incidents: Incident[];
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const theme = useTheme();
  const textColor = theme.palette.mode === "dark" ? "text-white" : "text-black";

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
    "border-radius": "25px",
    boxShadow: 24,
    p: 4,
  };

  if (alerts.length === 0 && incidents.length === 0) return <></>;

  return (
    <>
      <button
        onClick={handleOpen}
        className={` m-auto bg-transparent w-44 border-2 border-red-500 hover:bg-red-500 ${textColor} font-bold py-2 px-4 rounded mt-5`}>
        Avisos
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description">
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="border-b">
            Avisos
          </Typography>
          <ul className={`list-disc ${textColor}`}>
            {alerts.map(alert => {
              return (
                <li key={`${alert.codLine} ${alert.codMode}`} className="p-2 ">
                  {alert.description}
                </li>
              );
            })}

            {incidents.map(incident => {
              return (
                <li key={incident.title} className="p-2 ">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: incident.description.replace(/(<([^>]+)>)/gi, ""),
                    }}></div>
                  <Link className="text-sm  border-b mt-3" to={incident.url}>
                    Mas Informacion
                  </Link>
                  <div className="mt-3">
                    <pre className="text-sm">Desde {incident.from}</pre>
                    <pre className="text-sm">Hasta {incident.to}</pre>
                  </div>
                </li>
              );
            })}
          </ul>
        </Box>
      </Modal>
    </>
  );
}
