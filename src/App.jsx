import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import layout from './Components/Layout/Layout'
import profile from './Components/Profile/Profile'
import Login from './Components/Login/Login'
import Register from './Components/Register/Register'
import Notfound from './Components/Notfound/Notfound'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Layout from './Components/Layout/Layout'
import Profile from './Components/Profile/Profile'
import UserContextProvider from './Context/UserContext'
import Home from './Components/Home/Home'
import ProtectRoute from './Components/ProtectRoute/ProtectRoute'
import PostContextProvider from './Context/PostContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import SinglePost from './Components/SinglePost/SinglePost'
import UserPosts from './Components/UserPosts/UserPosts'
import { Toaster } from 'react-hot-toast';

let query = new QueryClient()

const router = createBrowserRouter([
  {path: '', element: <Layout />, children: [
    {index: true, element: <ProtectRoute>
      <Home />
    </ProtectRoute>},
    {path: 'profile', element: <ProtectRoute>
      <Profile />
    </ProtectRoute>},
    {path: 'singlepost/:id', element: <ProtectRoute>
      <SinglePost />
    </ProtectRoute>},
    {path: 'login', element: <Login />},
    {path: 'register', element: <Register />},
    {path: '*', element: <Notfound />},
  ]},
])

function App() {
  
  return (
    <>
        <UserContextProvider>
            <PostContextProvider>
              <Toaster />
              <QueryClientProvider client={query}>
                <RouterProvider router={router} />
              </QueryClientProvider>
            </PostContextProvider>
        </UserContextProvider>
    </>
  )
}

export default App
