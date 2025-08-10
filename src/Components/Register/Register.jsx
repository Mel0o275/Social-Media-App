import React, { useState } from 'react';
import style from './Register.module.css';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

export default function Register() {

  const [error, seterror] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // validation schema using zod
  const schema = z.object({
    name: z.string().min(1, 'Name is required').max(10, 'Name must be less than 10 characters'),
    email: z.email('Invalid email address'),
    password: z.string().regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, 'Must include at least capital letter & small letter & 1 number & 1 special character'),
    rePassword: z.string(),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format, use DD-MM-YYYY').refine((date) => {
      const today = new Date();
      const dob = new Date(date);
      dob.setHours(0, 0, 0, 0); // Normalize time to midnight for comparison
      return dob < today;
    }, "Can't select a future date"),
    gender: z.enum(['male', 'female'], {
      errorMap: () => ({ message: 'Gender must be male or female' })
    })
  }).refine((obj) => obj.password === obj.rePassword, {
    error: "Passwords don't match",
    path: ['rePassword']
  })

  // Initialize the form with react-hook-form
  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      rePassword: '',
      dateOfBirth: '',
      gender: '',
    },
    resolver: zodResolver(schema),
  })
  const { register, handleSubmit, formState } = form;

  async function onSubmit(data) {
    setLoading(true);
    seterror('');
  
    try {
      const res = await axios.post('https://linked-posts.routemisr.com/users/signup', data);
      if (res.data.message === 'success') {
        navigate('/login');
        setLoading(false);
      }
    } catch (err) {
        seterror(err.response.data.error);
        setLoading(false);
      }
  
  }
  

  return (
    <div className="flex justify-center py-7">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <h1 className="text-6xl font-bold mb-6 text-center text-white">Create an Account</h1>
        <h3 className='text-red-600 text-center font-bold'>{error}</h3>

        {/* Username */}
        <label htmlFor="username" className="block mb-2 text-sm font-medium text-white dark:">
          Username
        </label>
        <div className="w-[700px] flex mb-4">
          <span className="inline-flex items-center px-3 text-sm text-white bg-gradient-to-br from-purple-900 to-black border-0 rounded-s-md  dark: dark: dark:">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 10c-3.314 0-6 2.014-6 4.5S6.686 20 10 20s6-2.014 6-4.5S13.314 12 10 12Z" />
            </svg>
          </span>
          <input
            type="text"
            {...register('name')}
            id="username"
            className="text-white rounded-e-lg bg-gradient-to-br from-purple-900 to-black border-0 focus:ring-purple-100 focus:border-purple-100 flex-1 min-w-0 w-full text-sm  p-2.5 dark:bg-gray-700 dark:"
            placeholder="elonmusk"
          />
        </div>
        {formState.errors.name && formState.touchedFields.name ? <p className='text-red-600 text-center mb-3'>{formState.errors.name.message}</p> : null}

        {/* Email */}
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-white dark:">
          Email
        </label>
        <div className="w-[700px] relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center ps-3.5 pointer-events-none text-white">
            <svg className="w-4 h-4  dark:" fill="currentColor" viewBox="0 0 20 16">
              <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
              <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
            </svg>
          </div>
          <input
            type="text"
            {...register('email')}
            id="email"
            className="border-0 ps-10 bg-gradient-to-br from-purple-900 to-black text-white text-sm rounded-lg  focus:ring-purple-100 focus:border-purple-100 block w-full p-2.5 dark:bg-gray-700 dark:"
            placeholder="name@domain.com"
          />
        </div>
        {formState.errors.name && formState.touchedFields.email ? <p className='text-red-600 text-center mb-3'>{formState.errors.name.message}</p> : null}


        {/* Password */}
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-white dark:">
          Password
        </label>
        <div className="w-[700px] relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center ps-3.5 pointer-events-none text-white">
            <svg className="w-4 h-4  dark:`" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a4 4 0 0 0-4 4v2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V6a4 4 0 0 0-4-4Zm-2 6V6a2 2 0 1 1 4 0v2H8Z" />
            </svg>
          </div>
          <input
            type="password"
            {...register('password')}
            id="password"
            className="border-0 ps-10 bg-gradient-to-br from-purple-900 to-black  text-white text-sm rounded-lg  focus:ring-purple-100 focus:border-purple-100 block w-full p-2.5 dark:bg-gray-700 dark:"
            placeholder="••••••••"
          />
        </div>
        {formState.errors.password && formState.touchedFields.password ? <p className='text-red-600 text-center mb-3'>{formState.errors.password.message}</p> : null}


        {/* Repeat Password */}
        <label htmlFor="w-[700px] repeat-password" className="block mb-2 text-sm font-medium text-white dark:">
          Repeat Password
        </label>
        <div className="w-[700px] relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center ps-3.5 pointer-events-none text-white">
            <svg className="w-4 h-4 dark:" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.586 11.414 9.172 10A4 4 0 1 0 5 14a4 4 0 0 0 3.586-2.414l1.828 1.828a1 1 0 0 0 1.414-1.414l-1.242-1.242Z" />
              <path d="M17 10h-4a1 1 0 0 0-1 1v1h-1a1 1 0 0 0 0 2h1v1a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1Z" />
            </svg>
          </div>
          <input
            type="password"
            {...register('rePassword')}
            id="rePassword"
            className="border-0 ps-10 bg-gradient-to-br from-purple-900 to-black  text-white text-sm rounded-lg  focus:ring-purple-100 focus:border-purple-100 block w-full p-2.5 dark:bg-gray-700 dark:"
            placeholder="••••••••"
          />
        </div>
        {formState.errors.rePassword && formState.touchedFields.rePassword ? (<p className='text-red-600 text-center mb-3'>{formState.errors.rePassword.message}</p>) : null}


        {/* Date of Birth */}
        <label htmlFor="dateOfBirth" className="block mb-2 text-sm font-medium text-white dark:text-white">
          Date of Birth
        </label>

        <div className="w-[700px] relative mb-6">
          <div className="absolute inset-y-0 left-0 flex items-center ps-3.5 pointer-events-none text-white">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4Z" />
              <path d="M0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
            </svg>
          </div>

          <input
            type="date"
            {...register('dateOfBirth')}
            id="dateOfBirth"
            className="border-0 ps-10 bg-gradient-to-br from-purple-900 to-black  text-white text-sm rounded-lg  focus:ring-purple-100 focus:border-purple-100  lock w-full p-2.5 
             dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 
             [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:invert"
          />
        </div>
        {formState.errors.dateOfBirth && formState.touchedFields.dateOfBirth ? <p className='text-red-600 text-center mb-3'>{formState.errors.dateOfBirth.message}</p> : null}



        {/* Gender */}
        <div className="mb-6">
          <label className="block mb-2 text-sm font-mediu dark:">Gender</label>
          <div className="flex items-center gap-6">
            <div className="flex items-center">
              <input id="male" type="radio" {...register('gender')} value="male" className="w-4 h-4 text-blue-600 focus:ring-blue-500 dark:focus:ring-blue-600" />
              <label htmlFor="male" className="ml-2 text-sm font-medium text-white dark:">Male</label>
            </div>
            <div className="flex items-center">
              <input id="female" type="radio" {...register('gender')} name="gender" value="female" className="w-4 h-4 text-purple-600 focus:ring-purple-500 dark:focus:ring-purple-600" />
              <label htmlFor="female" className="ml-2 text-sm font-medium text-white dark:">Female</label>
            </div>
          </div>
        </div>
        {formState.errors.gender && formState.touchedFields.gender ? <p className='text-red-600 text-center mb-3'>{formState.errors.gender.message}</p> : null}


        {/* Submit */}

        {loading ? (
          <button className="cursor-pointer animate-spin relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
          <span className="cursor-pointer animate-spin relative px-5 py-2.5 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent transition-all duration-75">
            
          </span>
        </button>
        ) : (<button className="cursor-pointer relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
          <span className="cursor-pointer relative px-5 py-2.5 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent transition-all duration-75">
            Register
          </span>
        </button>)}


      </form>
    </div>
  );
}
