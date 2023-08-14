import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { GetAbono } from "./api/Abono"
import { fold } from "fp-ts/lib/Either"
import { AbonoType } from "./api/Types"
import { useTheme } from "@mui/material"
import { AbonoIcon } from "./api/Utils"

export default function AbonoInfo() {
    const { code } = useParams<{ code: string }>()
    const [abono, setAbono] = React.useState<AbonoType>()
    const [error, setError] = React.useState<string | null>(null)
    const theme = useTheme()
    const textColor = theme.palette.mode === 'dark' ? "text-white" : "text-black"
    const borderColor = theme.palette.mode === 'dark' ? "border-white" : "border-black";

    useEffect(() => {
        GetAbono(code!).then((abono) => {
            fold(
                (error: string) => setError(error),
                (abono: AbonoType) => setAbono(abono)
            )(abono)
        })
    }, [code])

    if (error !== null) return <div className=" text-center">{error}</div>
    if (abono === undefined) return <div className=" text-center">Cargando...</div>

    var options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

    return (
        <div className={`grid grid-cols-1 p-5 max-w-md mx-auto w-full justify-center`}>
            <div className={`flex flex-col ${textColor}`}>
                <div className="max-w-sm rounded overflow-hidden shadow-2xl">
                    <div className="px-6 py-4">
                        <div className="flex items-baseline">
                            <img className="w-8 h-5 mr-3" src={AbonoIcon} alt="Tarjeta transporte" />
                            <div className="font-bold text-xl mb-2">{abono.ttpNumber}</div>
                        </div>
                        <ul>
                            {
                                abono.contracts.length === 0 ?
                                    <div>Tarjeta sin recargas</div> :
                                    abono.contracts.map((contract) => {
                                        if (contract.charges !== 0 || contract.remainingCharges !== 0) {
                                            return (
                                                <li className={`p-3 border-b ${borderColor}`}>
                                                    <div>
                                                        <div className=" font-bold">{contract.contractName}</div>
                                                        <div className=" text-sm">
                                                            <div>Fecha recarga: {new Date(contract.chargeDate).toLocaleDateString("es-ES", options)}</div>
                                                            <div>Cargas: {contract.charges}</div>
                                                            <div>Cargas restantes: {contract.remainingCharges}</div>
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        }
                                        return (
                                            <li className={`p-3 border-b ${borderColor}`}>
                                                <div>
                                                    <div className=" font-bold">{contract.contractName}</div>
                                                    <div className=" text-sm">
                                                        <div>Fecha recarga: {new Date(contract.chargeDate).toLocaleDateString("es-ES", options)}</div>
                                                        <div>Fecha expiración: {new Date(contract.lastUseDate!).toLocaleDateString("es-ES", options)}</div>
                                                        {
                                                            contract.firstUseDate === null ?
                                                                <div>Fecha limite primer uso: {new Date(contract.firstUseDateLimit).toLocaleDateString("es-ES", options)}</div> :
                                                                <div>Fecha primer uso: {new Date(contract.firstUseDate).toLocaleDateString("es-ES", options)}</div>
                                                        }
                                                        <div>Dias restantes: {contract.leftDays}</div>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })
                            }
                        </ul>
                    </div>
                </div>

            </div>
        </div>
    )

}