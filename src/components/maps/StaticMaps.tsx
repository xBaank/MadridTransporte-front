import React from "react"
import { getIconByCodMode, getUrlByCodMode, metroCodMode, trainCodMode } from "../stops/api/Utils";
import { Link } from "react-router-dom";

export default function StaticMaps() {
    return (
        <div>
            <div className='grid grid-cols-2 p-5 max-w-md mx-auto content-around place-items-center'>
                <Map iconLink={getIconByCodMode(metroCodMode)} url={getUrlByCodMode(metroCodMode)} />
                <Map iconLink={getIconByCodMode(trainCodMode)} url={getUrlByCodMode(trainCodMode)} />
            </div>

        </div >
    )


    function Map({ iconLink, url }: { iconLink: string, url: string }) {
        return (
            <Link to={url} className="w-32 h-full flex-col justify-center items-center rounded-full shadow-lg shadow-gray-900 hover:shadow-gray-700">
                <div className="flex justify-center h-32 w-32">
                    <div className="flex h-full items-center justify-center">
                        <img className="w-20" src={iconLink} alt="Metro" />
                    </div>
                </div>
            </Link>
        )
    }
}