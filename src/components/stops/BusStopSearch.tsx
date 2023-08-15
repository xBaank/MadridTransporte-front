import { InputAdornment, TextField } from '@mui/material'
import React, { Fragment, useState } from 'react'
import { Search } from '@mui/icons-material';
import AllStopsComponent from './StopsComponent';
import StopsFavorites from './StopsFavorites';

export default function BusStopSearch() {
    const [query, setQuery] = useState<string>("")

    const search = (e: { target: { value: any; }; preventDefault: () => void; }) => {
        const value = e.target.value
        if (value === undefined) return
        setQuery(value)
        e.preventDefault()
    }


    return (
        <Fragment>
            <div>
                <div className='grid grid-cols-1 p-5 max-w-md mx-auto justify-center'>
                    <div className=' font-bold text-2xl pb-4'>Buscar parada</div>
                    <div className='mb-4 grid'>
                        <TextField
                            id="StopCode"
                            label="Codigo o nombre de la parada"
                            onChange={search}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position='end'>
                                        <Search />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </div>
                    {AllStopsComponent(query)}
                    {StopsFavorites()}
                </div>

            </div>
        </Fragment >
    )
}
