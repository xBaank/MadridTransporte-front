import React from "react";
import { Link } from "react-router-dom";

export default function Info() {

    return (
        <div className={`grid grid-cols-1 p-5 max-w-md mx-auto w-full justify-center`}>
            <div className={`px-6 py-4`}>
                <div className="font-bold text-xl mb-2">- Sobre este proyecto</div>
                <p className=" text-third text-base">
                    Este proyecto no esta afiliado a ninguna empresa de transporte publico, ni a ninguna empresa de desarrollo de software.
                </p>
                <br />
                <div className="font-bold text-xl mb-2">- Extraccion de datos</div>
                <p>
                    Todos los datos se extraen de Metro de Madrid, EMT Madrid y Consorcio Regional de Transportes de Madrid.
                </p>
                <br />
                <div className="font-bold text-xl mb-2">- Problemas</div>
                <p>
                    Si encuentras algun problema, puedes reportarlo <Link className="border-b" to={"https://github.com/xBaank/bus-tracker/issues/new"}>Aqui</Link>
                </p>

            </div>
        </div>
    )
}