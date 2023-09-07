import React from "react";
import ErrorIcon from '@mui/icons-material/Error';

export default function ErrorMessage({ message }: { message: string }) {
    return <>
        <div className="flex font-bold text-lg flex-col justify-center text-center items-center m-auto">
            <ErrorIcon className="text-red-500" fontSize="large" />
            <div className="text-red-500">{message}</div>
        </div>
    </>
}