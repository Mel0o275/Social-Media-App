import React, { useState, useContext  } from 'react';
import style from './Login.module.css';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';


export default function Login() {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  let {userLogin, setuserLogin} = useContext(UserContext);

  const navigate = useNavigate();

  // validation schema using zod
  const schema = z.object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        'Must include at least capital letter, small letter, 1 number, and 1 special character'
      ),
  });

  // Initialize the form with react-hook-form
  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(schema),
  });

  const { register, handleSubmit, formState } = form;

  async function onSubmit(data) {
    setLoading(true);
  
    try {
      const res = await axios.post('https://linked-posts.routemisr.com/users/signin', data);
      if (res.data.message === 'success') {
        setLoading(false); 
        localStorage.setItem('token', res.data.token);
        setuserLogin(res.data.token);
        navigate('/');
        
      }
    } catch (err) {
      seterror(err.response.data.error);
      setLoading(false);
    }
  }
  

  return (
    <div className="flex justify-center py-7">
      <form onSubmit={handleSubmit(onSubmit)} className="w-[700px]">
        {/* Header */}
        <h1 className="text-6xl font-bold mb-6 text-center text-white">Login</h1>
        {error && <h3 className="text-red-600 text-center font-bold">{error}</h3>}
  
        {/* Email */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-white"
          >
            Email
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center ps-3.5 pointer-events-none text-white">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 16"
                aria-hidden="true"
              >
                <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
              </svg>
            </span>
            <input
              type="email"
              {...register("email")}
              id="email"
              className="border-0 ps-10 bg-gradient-to-br from-purple-900 to-black text-white text-sm rounded-lg focus:ring-purple-100 focus:border-purple-100 block w-full p-2.5"
              placeholder="name@domain.com"
              aria-invalid={!!formState.errors.email}
            />
          </div>
          {formState.errors.email && formState.touchedFields.email && (
            <p className="text-red-600 text-center text-sm mt-1">
              {formState.errors.email.message}
            </p>
          )}
        </div>
  
        {/* Password */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-white"
          >
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center ps-3.5 pointer-events-none text-white">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M10 2a4 4 0 0 0-4 4v2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V6a4 4 0 0 0-4-4Zm-2 6V6a2 2 0 1 1 4 0v2H8Z" />
              </svg>
            </span>
            <input
              type="password"
              {...register("password")}
              id="password"
              className="border-0 ps-10 bg-gradient-to-br from-purple-900 to-black text-white text-sm rounded-lg focus:ring-purple-100 focus:border-purple-100 block w-full p-2.5"
              placeholder="••••••••"
              aria-invalid={!!formState.errors.password}
            />
          </div>
          {formState.errors.password && formState.touchedFields.password && (
            <p className="text-red-600 text-center text-sm mt-1">
              {formState.errors.password.message}
            </p>
          )}
        </div>
  
        {/* Submit Button */}
        {loading ? (
          <button className="mt-7 cursor-pointer animate-spin relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800" disabled="true">
          <span className="cursor-pointer animate-spin relative px-5 py-2.5 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent transition-all duration-75">
            
          </span>
        </button>
        ) : (<button className="mt-7 cursor-pointer relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
          <span className="cursor-pointer relative px-5 py-2.5 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent transition-all duration-75">
            Login
          </span>
        </button>)}

      </form>
    </div>
  );
  
}
