import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import UserPosts from '../UserPosts/UserPosts'
import AddPost from '../AddPost/AddPost'
import ChangeUserImage from '../ChangeUserImage/ChangeUserImage'
import ChangePass from '../ChangePass/ChangePass'

export default function Profile() {

  function GetUserData() {
    return axios.get(`https://linked-posts.routemisr.com/users/profile-data`, {
      headers: {
        token: localStorage.getItem("token")
      }
    })
  }

  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["userData"],
    queryFn: GetUserData
  })

  if (isError) {
    return (
      <h2 className="text-red-400 text-center mt-10 text-lg">
        {error.message}
      </h2>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-500 border-solid"></div>
      </div>
    )
  }

  const user = data?.data?.user;

  if (!user) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <p className="text-white text-lg">Loading user data...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black text-white relative overflow-hidden">
  
      {/* Background blurred circles */}
      <div className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] bg-purple-500 rounded-full top-[-100px] left-[-100px] blur-3xl opacity-30"></div>
      <div className="absolute w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] bg-indigo-400 rounded-full bottom-[-100px] right-[-100px] blur-3xl opacity-30"></div>
  
      {/* Header */}
      <div className="w-full text-center py-8 sm:py-12 mb-4">
      </div>
  
      {/* Profile Card */}
      <div className="w-[95%] sm:w-[85%] md:w-[70%] lg:w-[50%] mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 sm:p-8 shadow-xl relative z-10">
        <div className="flex flex-col items-center gap-6 relative">
          
          {/* Profile Image with Update Button */}
          <div className="relative">
            <img
              src={user.photo}
              alt={user.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-purple-500 shadow-lg object-cover"
            />
            <ChangeUserImage />
          </div>
  
          {/* Username */}
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-purple-200 tracking-wide">{user.name}</h2>
          </div>
  
          <div className="w-full mt-6 space-y-6">
            {/* Email Section */}
            <div className="bg-purple-900/40 p-4 sm:p-5 rounded-xl shadow-inner border border-purple-700 transition-shadow hover:shadow-purple-600/50">
              <p className="text-gray-400 uppercase text-[10px] sm:text-xs font-semibold mb-1">Email</p>
              <p className="text-white font-medium break-all text-sm sm:text-base">{user.email}</p>
            </div>
  
            {/* Password Section */}
            <div className="bg-purple-900/40 p-4 sm:p-5 rounded-xl shadow-inner border border-purple-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="text-gray-400 uppercase text-[10px] sm:text-xs font-semibold mb-1">Password</p>
                <p className="text-white font-medium italic tracking-wide text-sm sm:text-base">********</p>
              </div>
              <ChangePass />
            </div>
  
            {/* Birthday & Gender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-300">
              <div className="bg-purple-900/40 p-4 sm:p-5 rounded-xl shadow-inner border border-purple-700">
                <p className="text-gray-400 uppercase text-[10px] sm:text-xs font-semibold mb-1">Birthday</p>
                <p className="text-white font-medium">{user.dateOfBirth || "N/A"}</p>
              </div>
              <div className="bg-purple-900/40 p-4 sm:p-5 rounded-xl shadow-inner border border-purple-700">
                <p className="text-gray-400 uppercase text-[10px] sm:text-xs font-semibold mb-1">Gender</p>
                <p className="text-white font-medium capitalize">{user.gender || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <AddPost />
      <UserPosts />
    </div>
  );
  
}
