import React, { useContext, useEffect, useState } from 'react'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { BottomNavigation, BottomNavigationAction, Paper, useTheme } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { ColorModeContext } from '..';
import { Link, useLocation } from 'react-router-dom';
import CreditCardIcon from '@mui/icons-material/CreditCard';

export default function MobileNavBar() {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);
    const [value, setValue] = useState('Buscar');
    const location = useLocation();

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        if (newValue === "Tema") return
        setValue(newValue);
    };

    useEffect(() => {
        const path = location.pathname
        if (path.startsWith("/stops/map")) setValue("Mapa")
        else if (path.startsWith("/abono")) setValue("Abono")
        else if (path.startsWith("/info")) setValue("Sobre")
        else setValue("Buscar")
    }, [location])

    useEffect(() => {
        localStorage.setItem('theme', theme.palette.mode)
    }, [theme.palette.mode])

    return (
        <div style={{ position: 'sticky', bottom: 0 }} className='z-50 w-full mt-auto self-end justify-between overflow-clip' >
            <Paper >
                <BottomNavigation
                    value={value}
                    onChange={handleChange}
                >
                    <BottomNavigationAction
                        component={Link}
                        to={"/"}
                        label="Buscar"
                        value="Buscar"
                        icon={<DirectionsBusIcon />} />
                    <BottomNavigationAction
                        component={Link}
                        to={"/stops/map"}
                        label="Mapa"
                        value="Mapa"
                        icon={<MapIcon />} />
                    <BottomNavigationAction
                        component={Link}
                        to={"/abono"}
                        label="Abono"
                        value="Abono"
                        icon={<CreditCardIcon />} />
                    <BottomNavigationAction
                        component={Link}
                        to={"/info"}
                        label="Info"
                        value="Sobre"
                        icon={<HelpOutlineIcon />} />
                    <BottomNavigationAction
                        label="Tema"
                        value="Tema"
                        onClick={colorMode.toggleColorMode}
                        icon={
                            theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />
                        } />
                </BottomNavigation>
            </Paper>
        </div>
    )
}
