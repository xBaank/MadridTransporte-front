import { IconButton, InputAdornment, TextField } from '@mui/material'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Favorite, getFavourites, isLogged } from '../../api/api';
import { DeleteFavorite } from '../DeleteFavorite';
import { Search } from '@mui/icons-material';
import AllStopsComponent from './StopsComponent';

export default function BusStopSearch() {
    const navigate = useNavigate();
    const stopCode = useRef<HTMLInputElement>()
    const [favorites, setFavorites] = useState<Favorite[]>([]);
    const [query, setQuery] = useState<string>("")

    useEffect(() => {
        const loadFavorites = async () => {
            const favorites = await getFavourites(localStorage.getItem('token')!)
            if (typeof favorites === 'number') return <></>
            if (favorites.length === 0) return <></>
            setFavorites(favorites)
        }
        loadFavorites()
    }, [])

    const favoritesComponent = () => {
        if (favorites.length === 0) return <></>
        return DeleteFavorite(favorites, "bus", "/stops")
    }

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
                </div>

            </div>
        </Fragment >
    )
}
