import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material'
import React, { Fragment } from 'react'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { register } from '../../api/api';

export default function Register() {
    const [showPassword, setShowPassword] = React.useState(false);
    const [success, setSuccess] = React.useState<boolean>();
    const [error, setError] = React.useState<string>();

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
                User created successfully (Check your email)
            </div>
        )
    }

    const handleSubmmit = async (e: any) => {
        e.preventDefault()

        const data = {
            email: e.target.elements.email.value,
            username: e.target.elements.username.value,
            password: e.target.elements.password.value
        }

        const result = await register(data)

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
                    <div className=' text-purple-600 font-bold text-2xl pb-4'>Register</div>
                    <InputLabel htmlFor="outlined-adornment-email">Email</InputLabel>
                    <TextField
                        name='email'
                        id="outlined-adornment-email"
                        type="text"
                    />
                    <InputLabel htmlFor="outlined-adornment-username">Username</InputLabel>
                    <TextField
                        name='username'
                        id="outlined-adornment-username"
                        type="text"
                    />
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

                    {success != undefined && success === true ? successComponent() : errorComponent()}

                    <div className='flex flex-row justify-center mt-3'>
                        <button className='bg-purple-600  text-white font-bold py-2 px-4 '>
                            Register
                        </button>
                    </div>
                </div>
            </form>
        </Fragment >
    )
}




