import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import avatar from "../assets/profile.png";
import styles from "../styles/Username.module.css";
import { useFormik } from "formik";
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";
import { profileValidation } from "../helper/validate";
import convertToBase64 from "../helper/convert";
import { PuffLoader } from "react-spinners";
import Box from "@mui/material/Box";
import extend from "../styles/Profile.module.css";
import useFetch from "../hook/fetch.hooks";
import { updateUser } from "../helper/helper.js";
import { useAuthStore } from '../store/store';

export default function Profile() {
  const [file, setFile] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { username } = useAuthStore(state => state.auth);

  const [{ isLoading, apiData, serverError }] = useFetch(`/user/${username}`);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const formik = useFormik({
    initialValues: {
      firstName: apiData?.firstName || "",
      lastName: apiData?.lastName || "",
      contact: apiData?.contact || "",
      email: apiData?.email || "",
      address: apiData?.address || "",
    },
    enableReinitialize: true,
    validate: profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      values = await Object.assign(values, { profile: file || apiData?.profile || '' });
      let updatePromise = updateUser(values);
      toast.promise(updatePromise, {
        loading: 'Updating...',
        success: <b>Update Successfully...!</b>,
        error: <b>Could not Update!</b>
      })
    },
  });

  const onUpload = async (e) => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  };

  function userLogout() {
    localStorage.removeItem('token');
    navigate('/');
  }

  if (isLoading) return <h1 className="text-2xl font-bold">isLoading...</h1>;
  if (serverError) return <h1 className="text-2xl text-red-500">{serverError.message}</h1>;

  return (
    <div className="container mx-auto">
      <Toaster position="top-center" reverseOrder={false} />
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
          }}
        >
          <PuffLoader size={70} color="#0080FF" />
        </Box>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className={`${styles.glass} max-w-lg w-full p-6`}>
            <div className="title flex flex-col items-center">
              <h4 className="text-3xl font-bold text-gray-600 mt-[-70px]">
                Profile
              </h4>
              <span className="py-1 text-sm w-2/3 text-center text-gray-500">
                Update profile details
              </span>
            </div>
            <form className="py-1" onSubmit={formik.handleSubmit}>
              <div className="profile flex justify-center py-4">
                <label htmlFor="profile">
                  <img
                    src={file || apiData?.profile || avatar}
                    className={`${styles.profile_img} ${styles.fixedSize} `}
                    alt="avatar"
                  />
                </label>
                <input
                  onChange={onUpload}
                  type="file"
                  id="profile"
                  name="profile"
                />
              </div>
              <div className="textbox flex flex-col justify-center gap-6">
                <div className="name flex gap-6">
                  <TextField
                    {...formik.getFieldProps("firstName")}
                    className={`${styles.textbox} ${extend.textbox}`}
                    type="text"
                    variant="standard"
                    label="First Name"
                  />
                  <TextField
                    {...formik.getFieldProps("lastName")}
                    className={`${styles.textbox} ${extend.textbox} `}
                    type="text"
                    variant="standard"
                    label="Last Name"
                  />
                </div>
                <div className="name flex gap-6">
                  <TextField
                    {...formik.getFieldProps("contact")}
                    className={`${styles.textbox} ${extend.textbox}`}
                    type="text"
                    variant="standard"
                    label="Contact"
                  />
                  <TextField
                    {...formik.getFieldProps("email")}
                    className={`${styles.textbox} ${extend.textbox}`}
                    type="text"
                    variant="standard"
                    label="Email"
                  />
                </div>
                <TextField
                  {...formik.getFieldProps("address")}
                  className={`${styles.textbox} ${extend.textbox} `}
                  type="text"
                  variant="standard"
                  label="Address"
                />
                <button className={extend.btn} type="submit">
                  Update
                </button>
              </div>
              <div className="text-center py-5">
                <span className="text-gray-500">
                  Come back later? <button onClick={userLogout} className="text-red-500"> Logout
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
