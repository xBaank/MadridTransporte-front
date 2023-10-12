import { InputAdornment, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { Search } from '@mui/icons-material';
import AllStopsComponent, { StopComponent } from './StopsComponent';
import StopsFavorites from './StopsFavorites';
import { Stop, StopLink } from './api/Types';
import { fold } from 'fp-ts/lib/Either'
import { getAllStops } from './api/Stops';
import { getIconByCodMode, getStopTimesLinkByMode } from './api/Utils';
import { useParams } from 'react-router-dom';
import AllSubscriptions from './StopsSubscriptions';
export default function BusStopSearch(
    { title, codMode }: { title: string, codMode: number | null }
) {
    const [query, setQuery] = useState<string>("")
    const [stops, setStops] = useState<Stop[]>([])
    const { code } = useParams();
    // code here refers to origin, this is only use in trains as the only way to show
    // the times are by origin and destination, so we need to know the origin to show

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

    const mapStopToStopLink = (stop: Stop): StopLink => {
        return {
            stop: stop,
            url: getStopTimesLinkByMode(stop.cod_mode, stop.stop_code.toString(), code ?? null),
            iconUrl: getIconByCodMode(stop.cod_mode),
        }
    }


    return (
        <div>
            <div className='grid grid-cols-1 p-5 max-w-md mx-auto justify-center'>
                {
                    code !== undefined && stops.length > 0 ?
                        <div className='flex mb-3 border-b-2'>
                            <div className='my-auto font-bold text-lg'>Origen: </div>
                            <ul>
                                {StopComponent(mapStopToStopLink(stops.find(stop => stop.stop_code.toString() === code && stop.cod_mode === codMode)!!))}
                            </ul>
                        </div>
                        :
                        <></>

                }
                <div className=' font-bold text-2xl pb-4'>{title}</div>
                <div className='mb-4 grid'>
                    <TextField fullWidth
                        id="StopCode"
                        label="Codigo o nombre de la parada"
                        onChange={search}
                        key={code}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <Search />
                                </InputAdornment>
                            )
                        }}
                    />
                </div>
                <AllStopsComponent query={query} stopLinks={stops.map(mapStopToStopLink)} codMode={codMode} />
                {
                    codMode !== null ?
                        <></>
                        :
                        <StopsFavorites />
                }
                <AllSubscriptions />
            </div>

        </div>
    )
}
