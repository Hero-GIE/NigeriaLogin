import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import styles from '../styles/Username.module.css';
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import useFetch from "../hook/fetch.hooks";
import { useAuthStore } from '../store/store.js';
import { passwordValidate } from '../helper/validate';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { verifyPassword } from '../helper/helper';

export default function Password() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const { username } = useAuthStore(state => state.auth);
  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);

  const formik = useFormik({
    initialValues: {
      password: 'admin@123'
    },
    validate: passwordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      let loginPromise = verifyPassword({ username, password: values.password });
      toast.promise(loginPromise, {
        loading: 'Checking...',
        success: <b>Login Successfully...!</b>,
        error: <b>Password Not Match!</b>
      });

      loginPromise.then(res => {
        let { token } = res.data;
        localStorage.setItem('token', token);
        setTimeout(() => {
          navigate('/profile');
        }, 3000);
      });
    }
  });

  if (isLoading) return <h1 className="text-2xl font-bold">Loading...</h1>;
  if (serverError) return <h1 className="text-2xl text-red-500">{serverError.message}</h1>;

  return (
    <div className='container mx-auto p-4'>
      <Toaster position='top-center' reverseOrder={false} />
      <div className='flex justify-center items-center min-h-screen'>
        <div className={`w-full max-w-md p-6 md:w-1/2 lg:w-1/3 ${styles.glass}`}>
          <div className='title flex flex-col items-center'>
            <h4 className='text-3xl  font-bold text-gray-600'>
              Hello {apiData?.firstName || apiData?.username}
            </h4>
            <span className='py-4 text-base md:text-lg lg:text-xl w-2/3 text-center text-gray-500'>
              Explore More by connecting with us
            </span>
          </div>
          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <img src={apiData?.profile || avatar} className={`${styles.profile_img} ${styles.fixedSize}`} alt='avatar' />
            </div>
            <div className='textbox flex flex-col justify-center gap-6'>
              <TextField
                {...formik.getFieldProps('password')}
                className='w-full'
                type={showPassword ? 'text' : 'password'}
                variant='standard'
                label='Password'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={handleClickShowPassword}
                        edge='end'
                        style={{ marginBottom: '5px', marginRight: '-7px' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              <button type='submit' className='bg-blue-500 w-full py-2.5 rounded-lg text-gray-50 text-xl shadow-sm text-center hover:bg-red-500 transition duration-200'>
                Sign In
              </button>
            </div>
            <div className='text-center py-4'>
              <span className='text-gray-500'>Forgot Password? <Link className='text-red-500' to='/recover'>Set Password</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
