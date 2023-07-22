import { TextField } from '@mui/material'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Favorite, getFavourites, isLogged } from '../../api/api';
import { DeleteFavorite } from '../DeleteFavorite';

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



    return (
        <Fragment>
            <form onSubmit={(e) => {
                e.preventDefault()
                console.log(stopCode.current?.value)
                navigate(`/stops/${stopCode.current?.value}`)
            }}>
                <div className='grid grid-cols-1 p-5 max-w-md mx-auto justify-center'>
                    <div className=' font-bold text-2xl pb-4'>Buscar por codigo de parada</div>
                    <TextField
                        id="StopCode"
                        label="Codigo de la parada"
                        inputRef={stopCode}
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
