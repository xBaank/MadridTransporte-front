import { InputAdornment, TextField } from '@mui/material'
import React, { Fragment, useEffect, useState } from 'react'
import { Search } from '@mui/icons-material';
import AllStopsComponent from './StopsComponent';
import StopsFavorites from './StopsFavorites';
import { Stop, StopLink } from './api/Types';
import { fold } from 'fp-ts/lib/Either'
import { getAllStops } from './api/Stops';
import { getIconByCodMode, getStopTimesLinkByMode } from './api/Utils';
import { useParams } from 'react-router-dom';
import { uniqueId } from 'lodash';

export default function BusStopSearch(
    { title, codMode }: { title: string, codMode: number | null }
) {
    const [query, setQuery] = useState<string>("")
    const [stops, setStops] = useState<Stop[]>([])
    const { code } = useParams();

    useEffect(() => {
        getAllStops().then((allStops) =>
            fold(
                () => { },
                (stops: Stop[]) => setStops(stops)
            )(allStops)
        )
    }, [])

    const search = (e: { target: { value: any; }; preventDefault: () => void; }) => {
        const value = e.target.value
        if (value === undefined) return
        setQuery(value)
        e.preventDefault()
    }

    const mapStopsToStopsLinks = (stop: Stop): StopLink => {
        return {
            stop: stop,
            url: getStopTimesLinkByMode(stop.cod_mode, stop.stop_code.toString(), code ?? null),
            iconUrl: getIconByCodMode(stop.cod_mode),
        }
    }


    return (
        <div>
            <div className='grid grid-cols-1 p-5 max-w-md mx-auto justify-center'>
                <div className=' font-bold text-2xl pb-4'>{title}</div>
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
                <AllStopsComponent query={query} stopLinks={stops.map(mapStopsToStopsLinks)} codMode={codMode} />
                {
                    codMode !== null ?
                        <></>
                        :
                        <StopsFavorites />
                }
            </div>

        </div>
    )
}
