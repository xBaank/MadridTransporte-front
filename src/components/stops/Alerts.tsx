import {Modal, Box, Typography, Button} from "@mui/material";
import {type Alert, type Incident} from "./api/Types";
import {useState} from "react";
import {Link} from "react-router-dom";

export default function RenderAlerts({
  alerts,
  incidents,
}: {
  alerts: Alert[];
  incidents: Incident[];
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  if (alerts.length === 0 && incidents.length === 0) return <></>;

  return (
    <div className="mt-2">
      <Button
        color="error"
        variant="contained"
        onClick={handleOpen}
        className={`w-full`}>
        Avisos
      </Button>
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
          <ul className={`list-disc`}>
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
    </div>
  );
}
