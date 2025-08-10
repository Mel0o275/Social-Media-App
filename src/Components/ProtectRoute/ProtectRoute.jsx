import React from 'react'
import style from './ProtectRoute.module.css'
import { Navigate } from 'react-router-dom';

export default function ProtectRoute(props) {
  if(localStorage.getItem('token')) {
    return props.children;
  }else{
    return <Navigate to='/login' />
  }
}
