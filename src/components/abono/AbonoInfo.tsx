import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { GetAbono } from "./api/Abono"
import { fold } from "fp-ts/lib/Either"
import { AbonoType } from "./api/Types"
import { useTheme } from "@mui/material"

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

    return (
        <div className={`grid grid-cols-1 p-5 max-w-md mx-auto w-full justify-center`}>
            <div className={`flex flex-col ${textColor}`}>
                <div className={`flex items-baseline border-b ${borderColor} font-bold text-xl`}>
                    <div>Tarjeta: </div>
                    <pre > {abono.ttpNumber}</pre>
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
                                                <div>{contract.contractName}</div>
                                                <div>Fecha recarga: {contract.chargeDate}</div>
                                                <div>Cargas: {contract.charges}</div>
                                                <div>Cargas restantes: {contract.remainingCharges}</div>
                                            </div>
                                        </li>
                                    )
                                }
                                return (
                                    <li className={`p-3 border-b ${borderColor}`}>
                                        <div>
                                            <div>{contract.contractName}</div>
                                            <div>Fecha recarga: {contract.chargeDate}</div>
                                            <div>Fecha expiración: {contract.lastUseDate}</div>
                                            <div>Dias restantes: {contract.leftDays}</div>
                                        </div>
                                    </li>
                                )
                            })
                    }
                </ul>
            </div>
        </div>
    )

}