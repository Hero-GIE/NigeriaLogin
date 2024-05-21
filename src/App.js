import React from 'react';
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom';

/** import all components */
import Username from './components/Username';
import Password from './components/Password';
import Register from './components/Register';
import Profile from './components/Profile';
import Recover from './components/Recover';
import Reset from './components/Reset';
import PageNotFound from './components/PageNotFound';

/** auth middleware */
import { AuthorizeUser, ProtectRoute } from './middleware/auth';

/** root routes */
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Username />} />
      <Route path="/register" element={<Register />} />
      <Route path="/password" element={<Password />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/recover" element={<Recover/>} />
      <Route path="/reset" element={<Reset />} />
      <Route path="*" element={<PageNotFound />} />
    </>
  )
);

export default function App() {
  return (
    <main>
        <RouterProvider router={router} />
    </main>
  );
}
