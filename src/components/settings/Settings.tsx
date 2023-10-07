import { Button, FormControlLabel, Switch, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { ColorModeContext } from "../..";
import { Brightness7 } from "@mui/icons-material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { changeMinutesDisplay, getMinutesDisplay } from "../stops/Utils";
import { Link } from "react-router-dom";

export default function Settings() {
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);
    const [minutesToDisplay, setMinutesToDisplay] = useState<boolean>(false)

    useEffect(() => {
        setMinutesToDisplay(getMinutesDisplay())
    }, [theme.palette.mode])

    const handleMinutesDisplayChange = () => {
        setMinutesToDisplay(!minutesToDisplay)
        changeMinutesDisplay()
    }

    function SwitchMinutes() {
        return <>
            <AccessTimeIcon className="mr-3" />

            <FormControlLabel
                control={
                    <Switch checked={minutesToDisplay} onChange={handleMinutesDisplayChange} name="gilad" />
                }
                label="Ver tiempo de espera en minutos"
            />
        </>
    }


    function SwitchTheme() {
        return (<div className="flex items-center">
            <div className="mr-3"><Brightness7 /></div>

            <FormControlLabel
                control={
                    <Switch checked={theme.palette.mode === "light"} onChange={colorMode.toggleColorMode} name="gilad" />
                }
                label="Modo claro"
            />
        </div>)
    }



    return (
        <div className={`grid grid-cols-1 p-5 max-w-md mx-auto w-full justify-center`}>
            <div className=" text-2xl font-bold ">Ajustes</div>
            <div className="flex items-center space-x-4 mt-5">
                <ul className="w-full border p-2 border-blue-900 rounded">
                    <li className="w-full ">
                        <SwitchTheme />
                    </li>
                    <li className="w-full">
                        <SwitchMinutes />
                    </li>
                    <li className="w-full mt-3">
                        <Button component={Link} to="/info" className="w-full" variant="contained">Mas Informacion</Button>
                    </li>
                </ul>
            </div>
        </div>
    )
}

