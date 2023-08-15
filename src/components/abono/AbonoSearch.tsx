import { Search } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import AbonoFavorites from "./AbonosFavorites";

export default function AbonoSearch() {
    const navigate = useNavigate()
    const [error, setError] = React.useState<string | null>(null)
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const abonoCode = e.currentTarget.AbonoCode.value
        if (abonoCode === undefined) {
            setError("Introduzca un codigo")
            return
        }
        if (abonoCode.length < 22) {
            setError("El codigo debe tener al menos 22 digitos")
            return
        }
        if (isNaN(abonoCode)) {
            setError("El codigo solo puede contener numeros")
            return
        }
        navigate(`/abono/${abonoCode}`)
    }
    return (
        <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 p-5 max-w-md mx-auto justify-center'>
                <div className=' font-bold text-2xl pb-4'>Buscar Abono</div>
                <div className='mb-4 grid'>
                    <TextField
                        id="StopCode"
                        name="AbonoCode"
                        label="Introduzca el numero completo"
                        onSubmit={() => { console.log("asd") }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <Search />
                                </InputAdornment>
                            )
                        }}
                    />
                    {
                        error !== null ? <div className="text-red-500">{error}</div> : null
                    }
                </div>
                {AbonoFavorites()}
            </div>

        </form>
    )
}