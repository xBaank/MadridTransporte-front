import { TextField } from '@mui/material'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { createSearchParams, useNavigate } from "react-router-dom";
import { Favorite, getFavourites, isLogged } from '../../api/api';
import { DeleteFavorite } from '../DeleteFavorite';

export default function MetroStopSearch() {
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
        return DeleteFavorite(favorites, "metro", "/metro")
    }

    return (
        <Fragment>
            <form onSubmit={(e) => {
                e.preventDefault()
                navigate({
                    pathname: `/metro/search`,
                    search: createSearchParams({ estacion: stopCode.current?.value ?? "" }).toString(),
                })
            }}>
                <div className='grid grid-cols-1 p-5 max-w-md mx-auto justify-center'>
                    <div className=' text-purple-600 font-bold text-2xl pb-4'>Buscar por estacion</div>
                    <TextField
                        id="StopCode"
                        label="Nombre de la estacion"
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
