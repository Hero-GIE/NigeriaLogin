import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import avatar from '../assets/profile.png';
import styles from '../styles/Username.module.css';
import { useFormik } from 'formik';
import { Toaster } from 'react-hot-toast';
import { resetPasswordValidate } from '../helper/validate';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Reset() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClickShowPassword = (fieldName) => {
    if (fieldName === 'password') {
      setShowPassword(!showPassword);
    } else if (fieldName === 'confirm_pwd') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };
  const formik = useFormik({
    initialValues: {
      password: 'admin123',
      confirm_pwd: 'admin123',
    },
    validate: resetPasswordValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder={false}></Toaster>
      <div className='flex justify-center items-center min-h-screen'>
        <div className={`${styles.glass} max-w-md w-full p-6`}>
          <div className='title flex flex-col items-center'>
            <h4 className='text-3xl font-bold text-gray-600'>Reset</h4>
            <span className='py-1 text-lg w-2/3 text-center text-gray-500'>
              Enter new password
            </span>
          </div>
          <form className='py-10' onSubmit={formik.handleSubmit}>
            <div className='textbox flex flex-col justify-center gap-6'>
              <TextField
                {...formik.getFieldProps('password')}
                type={showPassword ? 'text' : 'password'}
                variant='standard'
                label='New password'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={() => handleClickShowPassword('password')}
                        edge='end'
                        style={{ marginBottom: '5px', marginRight: '-7px' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                {...formik.getFieldProps('confirm_pwd')}
                type={showConfirmPassword ? 'text' : 'password'}
                variant='standard'
                label='Confirm password'
                InputProps={{
                  endAdornment: (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={() => handleClickShowPassword('confirm_pwd')}
                        edge='end'
                        style={{ marginBottom: '5px', marginRight: '-7px' }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <button type='submit' className={`${styles.btn} w-full`} variant='contained'>
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
