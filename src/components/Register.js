import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import avatar from '../assets/profile.png';
import styles from '../styles/Username.module.css';
import { useFormik } from 'formik';
import toast, { Toaster } from 'react-hot-toast';
import { registerValidation } from '../helper/validate';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import convertToBase64 from '../helper/convert';
import { registerUser } from '../helper/helper';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [file, setFile] = useState();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClickShowPassword = (fieldName) => {
    if (fieldName === 'password') {
      setShowPassword(!showPassword);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: 'doyol56239@cnogs.com',
      username: 'example123',
      password: 'admin@123',
    },
    validate: registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file });
      let registerPromise = registerUser(values);
      toast.promise(registerPromise, {
        loading: 'Creating...',
        success: <b>Register Successfully...!</b>,
        error: <b>Could not Register.</b>,
      }).then(() => {
        setLoading(false);
        setTimeout(() => navigate('/'), 3000);
      });
    },
  });

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  return (
    <div className='container mx-auto p-4'>
      <Toaster position='top-center' reverseOrder={false} />
      <div className='flex justify-center items-center min-h-screen'>
        <div className={`w-full max-w-md p-6 md:w-1/2 lg:w-1/3 ${styles.glass}`}>
          <div className='title flex flex-col items-center'>
            <h4 className='text-3xl font-bold text-gray-600'>Register</h4>
          </div>
          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <label htmlFor="profile">
                <img src={file || avatar} className={`${styles.profile_img} ${styles.fixedSize}`} alt='avatar' />
              </label>
              <input onChange={onUpload} type="file" id='profile' name='profile' />
            </div>
            <div className='textbox flex flex-col justify-center gap-6'>
              <TextField {...formik.getFieldProps('email')}
                className='w-full'
                type='text' variant='standard' label='Email' required
              />
              <TextField {...formik.getFieldProps('username')}
                className='w-full'
                type='text' variant='standard' label='Username' required
              />
              <TextField
                {...formik.getFieldProps('password')}
                className='w-full'
                type={showPassword ? 'text' : 'password'}
                variant='standard'
                label='Password'
                required
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
              <button type='submit' className='bg-blue-500 w-full py-2.5 rounded-lg text-gray-50 text-xl shadow-sm text-center hover:bg-red-500 transition duration-200'>
                Sign Up
              </button>
            </div>
            <div className='text-center py-4'>
              <span className='text-gray-500'>Already Signed Up? <Link className='text-red-500' to='/'>Sign In</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
