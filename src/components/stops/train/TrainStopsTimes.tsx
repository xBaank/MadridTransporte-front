import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fold } from "fp-ts/lib/Either";
import { getTrainStopsTimes } from "../api/Times";
import { TrainStopTimes } from "../api/Types";
import React from "react";

export default function TrainStopTimesComponent() {
    const [searchParams] = useSearchParams();
    const origin = searchParams.get("origin");
    const destination = searchParams.get("destination");
    const [times, setTimes] = useState<TrainStopTimes>();
    const [error, setError] = useState<string>();

    useEffect(() => {
        if (origin === null || destination === null) {
            setError("No se ha seleccionado origen o destino");
            return;
        }
        getTrainStopsTimes(origin, destination).then((response) => {
            fold(
                (error: string) => setError(error),
                (times: TrainStopTimes) => setTimes(times)
            )(response)
        })
    }, [origin, destination])

    if (error !== undefined) return <div className="text-center">{error}</div>

    return (
        <>
            <div className={`grid grid-cols-1 p-5 max-w-md mx-auto w-full justify-center`}>
                <div>{times?.data.peticion.descEstOrigen} - {times?.data.peticion.descEstDestino}</div>
                <ul>
                    {
                        times?.data.horario.map((time) =>
                            <li>
                                <div>{time.linea}</div>
                                <div>{time.horaSalidaReal ?? time.horaSalida}</div>
                            </li>
                        )
                    }
                </ul>
            </div>
        </>
    )
}