import React from 'react'
import { Link } from 'react-router-dom'

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
                            <h3 className='text-white  hover:text-purple-500'>Bus</h3>
                        </Link>
                    </li>
                    <li className='mr-5'>
                        <Link to={"/metro"}>
                            <h3 className='text-white  hover:text-purple-500'>Metro</h3>
                        </Link>
                    </li>
                    <li className='mr-5'>
                        <Link to={"/register"}>
                            <h3 className='text-white  hover:text-purple-500'>Register</h3>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}
