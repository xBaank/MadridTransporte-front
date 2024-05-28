import {Button, FormControlLabel, Switch, useTheme} from "@mui/material";
import React, {useState} from "react";
import {Brightness7} from "@mui/icons-material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {changeMinutesDisplay, getMinutesDisplay} from "../../hooks/hooks";
import {Link} from "react-router-dom";
import {ColorModeContext} from "../../contexts/colorModeContext";
import {addStops, getAllApiStops} from "../stops/api/Stops";
import RenderLoadStops from "./LoadStops";

export default function Settings() {
  const theme = useTheme();
  const [progress, setProgress] = useState(0);
  const colorMode = React.useContext(ColorModeContext);
  const [minutesToDisplay, setMinutesToDisplay] =
    useState<boolean>(getMinutesDisplay());

  const handleMinutesDisplayChange = () => {
    if (minutesToDisplay === undefined) return;
    setMinutesToDisplay(!minutesToDisplay);
    changeMinutesDisplay();
  };

  function ReloadStops() {
    return (
      <>
        <Button
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={async () => {
            setProgress(10);
            const stops = await getAllApiStops();
            if (stops._tag === "Left") {
              setProgress(0);
              return;
            }
            await addStops(stops.right, (current, total) => {
              setProgress((current / total) * 100);
            });
            console.log("Finished loading");
          }}
          className="w-full"
          variant="contained">
          Recargar paradas
        </Button>
      </>
    );
  }

  function SwitchMinutes() {
    return (
      <>
        <AccessTimeIcon className="mr-3" />

        <FormControlLabel
          control={
            <Switch
              checked={minutesToDisplay}
              onChange={handleMinutesDisplayChange}
              name="gilad"
            />
          }
          label="Tiempo en minutos"
        />
      </>
    );
  }

  function SwitchTheme() {
    return (
      <div className="flex items-center">
        <div className="mr-3">
          <Brightness7 />
        </div>

        <FormControlLabel
          control={
            <Switch
              checked={theme.palette.mode === "light"}
              onChange={colorMode.toggleColorMode}
              name="gilad"
            />
          }
          label="Modo claro"
        />
      </div>
    );
  }

  return (
    <>
      <div
        className={`grid grid-cols-1 p-5 max-w-md mx-auto w-full justify-center`}>
        <div className=" text-2xl font-bold ">Ajustes</div>
        <div className="flex items-center space-x-4 mt-5">
          <ul className="w-full ">
            <li className="w-full ">
              <RenderLoadStops progress={progress} />
            </li>
            <li className="w-full ">
              <SwitchTheme />
            </li>
            <li className="w-full">
              <SwitchMinutes />
            </li>
            <li className="w-full mt-3">
              <ReloadStops />
            </li>
            <li className="w-full mt-3 ">
              <Button
                component={Link}
                to="/info"
                className="w-full"
                variant="contained">
                Mas Informacion
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
