import React from 'react'
import { Link } from 'react-router-dom'
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import MapIcon from '@mui/icons-material/Map';
import { IconButton, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { ColorModeContext } from '..';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SettingsIcon from '@mui/icons-material/Settings';

function ThemeComponent() {
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);

    React.useEffect(() => {
        localStorage.setItem('theme', theme.palette.mode)
    }, [theme.palette.mode])

    return (
        <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
    );
}


export default function NavBar() {
    return (
        <div className='flex flex-row p-4 border-b-4 border-blue-900'>
            <div className='mx-2 my-auto'>
                <Link className='text-2xl whitespace-nowrap font-bold align-middle' to={"/"}>
                    Madrid Transporte
                </Link>
            </div>
            <div className='my-auto ml-2 border-l-2 border-blue-900 w-full'>
                <ul className='flex flex-row ml-5 mr-2 my-auto border-b-1 '>
                    <li className='mr-5 mt-2'>
                        <Link to={"/"}>
                            <div className='flex flex-row  hover:text-blue-500'>
                                <DirectionsBusIcon />
                                <h3 className='ml-1' >Buscar Paradas </h3>
                            </div>
                        </Link>
                    </li>
                    <li className='mr-5 mt-2'>
                        <Link to={"/stops/map"}>
                            <div className='flex flex-row  hover:text-blue-500'>
                                <MapIcon />
                                <h3 className='ml-1' >Mapa paradas </h3>
                            </div>
                        </Link>
                    </li>
                    <li className='mr-5 mt-2'>
                        <Link to={"/abono"}>
                            <div className='flex flex-row  hover:text-blue-500'>
                                <CreditCardIcon />
                                <h3 className='ml-1' >Abono </h3>
                            </div>
                        </Link>
                    </li>
                    <li className='mr-5 mt-2'>
                        <Link to={"/settings"}>
                            <div className='flex flex-row  hover:text-blue-500'>
                                <SettingsIcon />
                                <h3 className='ml-1' >Ajustes </h3>
                            </div>
                        </Link>
                    </li>
                    <li className='ml-auto'>
                        <ThemeComponent />
                    </li>
                </ul>
            </div>
        </div>
    )
}
