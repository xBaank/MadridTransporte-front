import { TextField } from '@mui/material'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Favorite, getFavourites, isLogged } from '../../api/api';
import { Link } from 'react-router-dom';

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
        return (<>
            <div
                className="bg-gray-100 border-t border-b border-gray-500 text-gray-700 p5 mb-3 text-center"
                role="alert"
            >
                <p className="font-bold">Paradas favoritas</p>
                {favorites.map((favorite) => (
                    favorite.stopType === 'bus' ?
                        <div className='p-2'>
                            <Link className="text-xl font-medium hover:text-purple-500" to={`/stops/${favorite.stopId}`} >
                                {favorite.stopId}
                            </Link>
                        </div>
                        :
                        <></>
                ))}
            </div>
        </>)
    }



    return (
        <Fragment>
            <form onSubmit={(e) => {
                e.preventDefault()
                console.log(stopCode.current?.value)
                navigate(`/stops/${stopCode.current?.value}`)
            }}>
                <div className='grid grid-cols-1 p-5 max-w-md mx-auto justify-center'>
                    <div className=' text-purple-600 font-bold text-2xl pb-4'>Buscar por codigo de parada</div>
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
