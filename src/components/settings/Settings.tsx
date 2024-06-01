import {Button, FormControlLabel, Switch, useTheme} from "@mui/material";
import React, {useContext, useState} from "react";
import {Brightness7} from "@mui/icons-material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import {changeMinutesDisplay, getMinutesDisplay} from "../../hooks/hooks";
import {Link} from "react-router-dom";
import {ColorModeContext} from "../../contexts/colorModeContext";
import {DataLoadContext} from "../../contexts/dataLoadContext";
import {db} from "../stops/api/Dba";

export default function Settings() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const dataLoaded = useContext(DataLoadContext);
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
          onClick={() => {
            db.stops
              .clear()
              .then(() => {
                dataLoaded.setDataLoaded({
                  loaded: false,
                });
              })
              .catch(() => console.error("Error deleting stops"));
          }}
          className="w-full"
          variant="contained">
          Actualizar paradas
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
