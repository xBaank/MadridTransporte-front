import React from 'react'
import { Link } from 'react-router-dom'
import { isLogged } from '../api/api';
import DirectionsTransitIcon from '@mui/icons-material/DirectionsTransit';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton, useTheme } from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { ColorModeContext } from '..';


function ThemeComponent() {
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);
    return (
        <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
    );
}


export default function NavBar() {
    return (
        <div className='flex flex-row p-4 border-b-4'>
            <div className='mx-2 my-auto min-w-[8%]'>
                <Link to={"/"}>
                    <h2 className='text-2xl  font-bold align-middle'>Bus Tracker</h2>
                </Link>
            </div>
            <div className='my-auto ml-2 border-l-2 border-purple-800 w-full'>
                <ul className='flex flex-row ml-5 mr-2 my-auto border-b-1 '>
                    <li className='mr-5 mt-2'>
                        <Link to={"/"}>
                            <div className='flex flex-row  hover:text-purple-500'>
                                <DirectionsBusIcon />
                                <h3 className='ml-1' >Bus </h3>
                            </div>
                        </Link>
                    </li>
                    <li className='mr-5 mt-2'>
                        <Link to={"/metro"}>
                            <div className='flex flex-row hover:text-purple-500'>
                                <DirectionsTransitIcon />
                                <h3 className='ml-1' >Metro </h3>
                            </div>
                        </Link>
                    </li>

                    <li className='mr-5 mt-2'>
                        {
                            !isLogged() ?
                                <Link to={"/login"}>
                                    <div className='flex flex-row hover:text-purple-500'>
                                        <LoginIcon />
                                        <h3 className='ml-1' >Login </h3>
                                    </div>
                                </Link>
                                :
                                <Link to={"/"} onClick={
                                    () => {
                                        localStorage.removeItem('token')
                                        window.location.reload();
                                    }
                                }>
                                    <div className='flex flex-row hover:text-purple-500'>
                                        <LogoutIcon />
                                        <h3 className='ml-1' >Logout </h3>
                                    </div>
                                </Link>
                        }
                    </li>

                    <li className='ml-auto'>
                        <ThemeComponent />
                    </li>
                </ul>
            </div>
        </div>
    )
}
