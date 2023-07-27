import { IconButton, InputAdornment, TextField } from '@mui/material'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Favorite, getFavourites, isLogged } from '../../api/api';
import { DeleteFavorite } from '../DeleteFavorite';
import { Search } from '@mui/icons-material';

export default function BusStopSearch() {
    const navigate = useNavigate();
    const stopCode = useRef<HTMLInputElement>()
    const [favorites, setFavorites] = useState<Favorite[]>([]);

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

    const submitF = (e: { preventDefault: () => void; }) => {
        const value = stopCode.current?.value
        if (value === undefined || value.trim() === "") return

        e.preventDefault()
        navigate(`/stops/${stopCode.current?.value}`)
    }


    return (
        <Fragment>
            <form onSubmit={submitF}>
                <div className='grid grid-cols-1 p-5 max-w-md mx-auto justify-center'>
                    <div className=' font-bold text-2xl pb-4'>Buscar parada</div>
                    <TextField
                        id="StopCode"
                        label="Codigo o nombre de la parada"
                        inputRef={stopCode}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton>
                                        <Search onClick={submitF} />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </div>
                {
                    isLogged() ?
                        favoritesComponent()
                        :
                        <></>
                }
            </form>
        </Fragment >
    )
}
