import { TextField } from '@mui/material'
import React, { Fragment, useRef } from 'react'
import { useNavigate } from "react-router-dom";

export default function BusStopSearch() {
    const navigate = useNavigate();
    const stopCode = useRef<HTMLInputElement>()
    return (
        <Fragment>
            <form onSubmit={(e) => {
                e.preventDefault()
                console.log(stopCode.current?.value)
                navigate(`stops/${stopCode.current?.value}`)
            }}>
                <div className='grid grid-cols-1 p-5 max-w-md mx-auto justify-center'>
                    <div className=' text-purple-600 font-bold text-2xl pb-4'>Buscar por parada</div>
                    <TextField
                        id="StopCode"
                        label="Codigo de la parada"
                        inputRef={stopCode}
                    />
                </div>
            </form>
        </Fragment >
    )
}