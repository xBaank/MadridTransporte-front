import React from "react"
import { Link } from "react-router-dom"
import { Favorite, deleteFavouriteById } from "../api/api"
import DeleteIcon from '@mui/icons-material/Delete';

export const DeleteFavorite = (favorites: Favorite[], type: string, path: string) => {
    return (
        <div
            className="bg-gray-100 border-t border-b border-gray-500 text-gray-700 p5 mb-3 text-center"
            role="alert"
        >
            <p className="font-bold">Paradas favoritas</p>
            {favorites.map((favorite) => (
                favorite.stopType === type ?
                    <div className='p-2'>
                        <Link className="text-xl font-medium hover:text-purple-500" to={`${path}/${favorite.stopId}`} >
                            {favorite.stopId}
                        </Link>
                        <Link className='ml-3 hover:text-purple-500' to={"#"} onClick={async () => {
                            //ask if you want to delete
                            const result = window.confirm("¿Estas seguro de que quieres eliminar esta parada de tus favoritos?")
                            if (!result) return
                            await deleteFavouriteById(localStorage.getItem('token')!, favorite.stopId)
                            window.location.reload()
                        }
                        }>
                            <DeleteIcon className=' mb-2' />
                        </Link>
                    </div>
                    :
                    <></>
            ))}
        </div>)
}