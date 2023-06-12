import React from 'react'
import { Link } from 'react-router-dom'
import { isLogged } from '../api/api';
import DirectionsTransitIcon from '@mui/icons-material/DirectionsTransit';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

export default function NavBar() {
    return (
        <div className='flex flex-row bg-slate-800 p-4 border-b-4 border-purple-800 '>
            <div className='mx-2 my-auto'>
                <Link to={"/"}>
                    <h2 className='text-2xl text-white font-bold align-middle'>Bus Tracker</h2>
                </Link>
            </div>
            <div className='my-auto ml-2 border-l-2 border-purple-800'>
                <ul className='flex flex-row ml-5 mr-2 my-auto border-b-1'>
                    <li className='mr-5'>
                        <Link to={"/"}>
                            <div className='flex flex-row text-white  hover:text-purple-500'>
                                <DirectionsBusIcon />
                                <h3 className='ml-1' >Bus </h3>
                            </div>
                        </Link>
                    </li>
                    <li className='mr-5'>
                        <Link to={"/metro"}>
                            <div className='flex flex-row text-white  hover:text-purple-500'>
                                <DirectionsTransitIcon />
                                <h3 className='ml-1' >Metro </h3>
                            </div>
                        </Link>
                    </li>
                    {
                        !isLogged() ?
                            <li className='mr-5'>
                                <Link to={"/login"}>
                                    <div className='flex flex-row text-white  hover:text-purple-500'>
                                        <LoginIcon />
                                        <h3 className='ml-1' >Login </h3>
                                    </div>
                                </Link>
                            </li>
                            :
                            <></>
                    }
                    {
                        isLogged() ?
                            <li className='mr-5'>
                                <Link to={"/"} onClick={
                                    () => {
                                        localStorage.removeItem('token')
                                        window.location.reload();
                                    }
                                }>
                                    <div className='flex flex-row text-white  hover:text-purple-500'>
                                        <LogoutIcon />
                                        <h3 className='ml-1' >Logout </h3>
                                    </div>
                                </Link>
                            </li>
                            :
                            <></>
                    }
                </ul>
            </div>
        </div>
    )
}
