import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput } from '@mui/material'
import React, { Fragment } from 'react'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { setNewPassword } from '../../api/api';
import { useSearchParams } from 'react-router-dom';

export default function NewPassword() {
    const [showPassword, setShowPassword] = React.useState(false);
    const [success, setSuccess] = React.useState<boolean>();
    const [error, setError] = React.useState<string>();
    const [searchParams] = useSearchParams();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const errorComponent = () => {
        return (
            <div className="text-red-700 text-center font-bold">
                {error}
            </div>
        )
    }

    const successComponent = () => {
        return (
            <div className=" text-green-400 text-center font-bold">
                Password reset successfully
            </div>
        )
    }

    const handleSubmmit = async (e: any) => {
        e.preventDefault()

        const token = searchParams.get('token')

        if (!token) {
            setError('Token is required')
            setSuccess(false)
            return
        }

        const data = {
            token: token,
            password: e.target.elements.password.value
        }

        const result = await setNewPassword(data)

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
                    <div className='font-bold text-2xl pb-4'>New password</div>
                    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                    <FormControl>
                        <OutlinedInput
                            name='password'
                            id="outlined-adornment-password"
                            type={showPassword ? 'text' : 'password'}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>

                    {success !== undefined && success === true ? successComponent() : errorComponent()}


                    <div className='flex flex-row justify-center mt-3'>
                        <button className='border-2 font-bold py-2 px-4 '>
                            Set new password
                        </button>
                    </div>


                </div>
            </form>
        </Fragment >
    )
}




