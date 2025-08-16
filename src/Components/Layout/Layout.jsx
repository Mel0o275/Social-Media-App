import React from 'react'
import style from './Layout.module.css'
import { Outlet } from 'react-router-dom'
import NavBar from '../NavBar/NavBar'
import Footer from '../Footer/Footer'

export default function Layout() {
  return (
    <>
      <NavBar />
  
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-24 sm:mt-28">
        <Outlet />
      </div>
  
      <Footer />
    </>
  );
  
}
