import React, {useState} from 'react'
import TextField from '@mui/material/TextField';
import { Link } from 'react-router-dom';
import avatar from '../assets/profile.png'
import styles from '../styles/Username.module.css'
import { useFormik } from 'formik';
import {Toaster} from 'react-hot-toast';
import { passwordValidate } from '../helper/validate';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Register() {  
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
  initialValues :  {
    Name:'',
    Email:'',
    School:'',
    Mat_No:'',
    password:'',
    confirm_pwd:''
  },
  validate: passwordValidate,
  validateOnBlur: false,
  validateOnChange: false,
  onSubmit: async values =>{
    console.log(values)
  }
})

  return (
    <div className='container mx-auto'>
      <Toaster position='top-center' reverseOrder = {false}></Toaster>
        <div className='flex justify-center items-center h-screen'>
       <div className={styles.glass }>
        <div className='title flex flex-col items-center mt-[-50px]'>
           <h4 className='text-2xl font-bold text-gray-600'>Sign Up</h4>  
        </div>
        <form className='py-0' onSubmit={formik.handleSubmit}>
            
            <div className='textbox flex flex-col justify-center gap-6'>  
            <TextField 
            {...formik.getFieldProps('Name')}
             type='text'
            variant='standard'
           label='Name'
           required
                    />

              <TextField
                {...formik.getFieldProps('Email')}
                type='email'
                variant='standard'
                label='Email'
                required
              />
              <TextField
                {...formik.getFieldProps('School')}
                type='text'
                variant='standard'
                label='School'
                required
              />
              <TextField
                {...formik.getFieldProps('Mat_No')}
                type='text'
                variant='standard'
                label='Matriculation Number'
                required
              />

           <TextField 
              {...formik.getFieldProps('password')}
              type={showPassword ? 'text' : 'password'}
              variant='standard'
              label='Password'
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
                )
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
                )
              }}
        />
                <button type='submit'className={styles.btn} variant='contained'>Sign Up</button>
            </div>
            <div className='text-center py-4'>
                <span className='text-gray-500'>Already have an account?   <Link className='text-red-500' to='/'>Sign In</Link></span>
            </div>

        </form>

       </div>
        </div>

    </div>
  )
}
