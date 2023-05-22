import { TextField } from '@mui/material'
import React, { Fragment, useRef } from 'react'
import { createSearchParams, useNavigate } from "react-router-dom";

export default function MetroStopSearch() {
    const navigate = useNavigate();
    const stopCode = useRef<HTMLInputElement>()
    return (
        <Fragment>
            <form onSubmit={(e) => {
                e.preventDefault()
                navigate({
                    pathname: `/metro/search`,
                    search: createSearchParams({ estacion : stopCode.current?.value ?? "" }).toString(),
                })
            }}>
                <div className='grid grid-cols-1 p-5 max-w-md mx-auto justify-center'>
                    <div className=' text-purple-600 font-bold text-2xl pb-4'>Buscar por parada de metro</div>
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
