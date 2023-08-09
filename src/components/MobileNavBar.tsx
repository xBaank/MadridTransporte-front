import React from 'react'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { BottomNavigation, BottomNavigationAction, Paper, useTheme } from '@mui/material';
import MapIcon from '@mui/icons-material/Map';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { ColorModeContext } from '..';
import { Link } from 'react-router-dom';

export default function MobileNavBar() {
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);
    const [value, setValue] = React.useState('Buscar');
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        if (newValue === "Tema") return
        setValue(newValue);
    };

    React.useEffect(() => {
        localStorage.setItem('theme', theme.palette.mode)
    }, [theme.palette.mode])

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} className='z-50' elevation={3}>
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
                    to={"/"}
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
    )
}
