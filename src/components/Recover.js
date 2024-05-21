import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/Username.module.css';
import { useFormik } from 'formik';
import { usernameValidate } from '../helper/validate';
import { useAuthStore } from '../store/store';
import { generateOTP, verifyOTP } from '../helper/helper';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export default function Recover() {
  const { username } = useAuthStore((state) => state.auth);
  const [OTP, setOTP] = useState(new Array(6).fill('')); // Initialize OTP state as an array of 6 empty strings
  const inputRefs = useRef([...Array(6)].map(() => React.createRef())); // Create 6 refs for input elements
  const navigate = useNavigate();

  useEffect(() => {
    generateOTP(username).then((OTP) => {
      console.log(OTP);
      if (OTP) return toast.success('OTP has been sent to your email!');
      return toast.error('Problem while generating OTP!');
    });
  }, [username]);

  async function onSubmit(e) {
    e.preventDefault();

    let { status } = await verifyOTP({ username, code: OTP });
    if (status === 201) {
      toast.success('Verify Successfully...!');
      return navigate('/reset');
    }
    return toast.error('Wrong OTP! Check email again!');
  }

  //handler of resend OTP
  function resendOTP() {
    let sendPromise = generateOTP(username);
    toast.promise(sendPromise, {
      loading: 'Sending...',
      success: <b>OTP has been sent to your email!</b>,
      error: <b>Could not send it!</b>,
    });
    sendPromise.then((OTP) => {
      console.log(OTP);
    });
  }

  const focusNextInput = (index) => {
    if (index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].current.focus();
    }
  };

  const focusPrevInput = (index) => {
    if (index > 0) {
      inputRefs.current[index - 1].current.focus();
    }
  };

  const formik = useFormik({
    initialValues: {
      otp1: '',
      otp2: '',
      otp3: '',
      otp4: '',
      otp5: '',
      otp6: '',
    },
    validate: usernameValidate,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  const handleChange = (e, index) => {
    const value = e.target.value;
    // Update formik field value
    formik.setFieldValue(`otp${index + 1}`, value);
    // Update OTP state
    const newOTP = [...OTP];
    newOTP[index] = value;
    setOTP(newOTP);

    // Focus the next input field if a value is entered, otherwise focus the previous input field if the value is deleted
    if (value !== '' && index < inputRefs.current.length - 1) {
      focusNextInput(index);
    } else if (value === '' && index > 0) {
      focusPrevInput(index);
    }
  };

  return (
    <div className='container mx-auto'>
      <div className='flex justify-center items-center min-h-screen'>
        <div className={`${styles.glass} max-w-md w-full p-6`}>
          <div className='title flex flex-col items-center'>
            <h4 className='text-3xl font-bold text-gray-600'>Recovery</h4>
            <span className='py-1 text-lg w-2/3 text-center text-gray-500'>
              Enter OTP to recover your password.
            </span>
          </div>
          <form className='py-10' onSubmit={onSubmit}>
            <div className='textbox flex flex-col justify-center gap-6'>
              <div className='input text-center'>
                <span className=' text-lg text-left text-gray-500'>
                  Enter 6 digit OTP sent to your email address.
                </span>

                <div className='flex justify-center gap-2' style={{ marginTop: '20px' }}>
                  {OTP.map((_, index) => (
                    <input
                      key={index}
                      ref={inputRefs.current[index]}
                      className={`${styles.textbox} ${styles.smallInput}`}
                      type='text'
                      maxLength='1'
                      value={formik.values[`otp${index + 1}`]}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !formik.values[`otp${index + 1}`]) {
                          focusPrevInput(index);
                        }
                      }}
                    />
                  ))}
                </div>
              </div>
              <button type='submit' className={styles.btn} variant='contained'>
                Recover
              </button>
            </div>
            <div className='text-center py-5'>
              <span className='text-gray-500'>
                Can't get OTP?{' '}
                <button onClick={resendOTP} className='text-red-500'>
                  Resend
                </button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
