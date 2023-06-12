import { InputLabel, TextField } from '@mui/material'
import React, { Fragment } from 'react'
import { sendResetPassword } from '../../api/api';

export default function ResetPassword() {
    const [success, setSuccess] = React.useState<boolean>();
    const [error, setError] = React.useState<string>();


    const successComponent = () => {
        return (
            <div className=" text-green-400 text-center font-bold">
                Email sent successfully (Check your email)
            </div>
        )
    }

    const errorComponent = () => {
        return (
            <div className="text-red-700 text-center font-bold">
                {error}
            </div>
        )
    }

    const handleSubmmit = async (e: any) => {
        e.preventDefault()

        const data = {
            email: e.target.elements.email.value
        }

        const result = await sendResetPassword(data)

        console.log(result)

        if (typeof result === 'string') {
            setError(result)
            setSuccess(false)
        }
        else {
            setSuccess(true)
        }
    }


    return (
        <Fragment>
            <form onSubmit={handleSubmmit}>
                <div className='grid grid-cols-1 p-5 max-w-md mx-auto justify-center'>
                    <div className=' text-purple-600 font-bold text-2xl pb-4'>Reset password</div>
                    <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
                    <TextField
                        name='email'
                        id="outlined-adornment-email"
                        type="text"
                    />

                    {success != undefined && success === true ? successComponent() : errorComponent()}

                    <div className='flex flex-row justify-center mt-3'>
                        <button className='bg-purple-600  text-white font-bold py-2 px-4 '>
                            Send email
                        </button>
                    </div>
                    <div className=' text-blue-400 flex flex-row text-center mt-3'>
                        <div>
                            We will send you an email with a link to reset your password
                        </div>
                    </div>
                </div>
            </form>
        </Fragment >
    )
}




