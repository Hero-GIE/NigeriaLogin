import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { Link, useNavigate } from 'react-router-dom';
import avatar from '../assets/profile.png';
import styles from '../styles/Username.module.css';
import extend from '../styles/Profile.module.css';
import { useFormik } from 'formik';
import { Toaster } from 'react-hot-toast';
import { usernameValidate } from '../helper/validate';
import { useAuthStore } from '../store/store';

export default function Username() {
  const [loading, setLoading] = useState(true);
  const setUsername = useAuthStore(state => state.setUsername);
  const username = useAuthStore(state => state.auth.username);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(username);
  }, [username]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const formik = useFormik({
    initialValues: {
      username: 'example123'
    },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async values => {
      setUsername(values.username);
      navigate('/password');
    }
  });

  return (
    <div className='container mx-auto p-4'>
      <Toaster position='top-center' reverseOrder={false} />
      <div className='flex justify-center items-center min-h-screen'>
        <div className={`w-full max-w-md p-6 md:w-1/2 lg:w-1/3 ${styles.glass} ${extend.glass}`}>
          <div className='title flex flex-col items-center'>
            <h4 className='text-3xl  font-bold text-gray-600'>Hello Again</h4>
            <span className='py-4 text-base md:text-lg lg:text-xl w-2/3 text-center text-gray-500'>
              Explore More by connecting with us
            </span>
          </div>
          <form className='py-1' onSubmit={formik.handleSubmit}>
            <div className='profile flex justify-center py-4'>
              <img src={avatar} className={`${styles.profile_img} ${extend.profile_img}`} alt='avatar' />
            </div>
            <div className='textbox flex flex-col justify-center gap-6'>
              <TextField
                {...formik.getFieldProps('username')}
                className='w-full'
                type='text'
                variant='standard'
                label='Username'
              />
              <button type='submit' className={`${styles.btn} ${extend.btn}`}>
                Sign In
              </button>
            </div>
            <div className='text-center py-4'>
              <span className='text-gray-500'>Don't have an account <Link className='text-red-500' to='/register'>Sign Up</Link></span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
