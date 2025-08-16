import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';  // I recommend this for notifications

export default function ChangePass() {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      password: "",
      newPassword: ""
    }
  });

  const { register, handleSubmit, formState: { errors }, reset } = form;

  async function changePass(values) {
    try {
      const res = await axios.patch(
        `https://linked-posts.routemisr.com/users/change-password`,
        values,
        {
          headers: {
            token: localStorage.getItem('token'),
          },
        }
      );
      toast.success("Password changed successfully");
      localStorage.setItem('token', res.data.token);
      reset();
      setIsOpen(false);
    } catch (err) {
      toast.error("Failed to change password");
      console.error(err);
    }
  }

  return (
    <>
      <button
        type="button"
        className="text-purple-400 hover:text-purple-200 transition-colors flex items-center gap-2 font-semibold cursor-pointer"
        aria-label="Change Password"
        onClick={() => setIsOpen(true)}
      >
        <i className="fa-solid fa-key"></i> Change
      </button>
  
      {isOpen && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-purple-900 to-purple-800 bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-purple-900 p-4 sm:p-6 rounded-lg shadow-lg w-[90%] sm:max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white text-lg sm:text-xl font-bold mb-4">
              Change Password
            </h3>
            <form
              onSubmit={handleSubmit(changePass)}
              className="flex flex-col gap-3 sm:gap-4"
            >
              <div>
                <label
                  className="block text-gray-300 mb-1 text-sm sm:text-base"
                  htmlFor="password"
                >
                  Current Password
                </label>
                <input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Current password is required",
                  })}
                  className="w-full p-2 sm:p-3 rounded bg-gray-800 text-white text-sm sm:text-base"
                  autoComplete="current-password"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
  
              <div>
                <label
                  className="block text-gray-300 mb-1 text-sm sm:text-base"
                  htmlFor="newPassword"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  {...register("newPassword", {
                    required: "New password is required",
                  })}
                  className="w-full p-2 sm:p-3 rounded bg-gray-800 text-white text-sm sm:text-base"
                  autoComplete="new-password"
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>
  
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-2">
                <button
                  type="button"
                  className="px-3 sm:px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white cursor-pointer w-full sm:w-auto"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 sm:px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white cursor-pointer disabled:cursor-not-allowed w-full sm:w-auto"
                >
                  Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
  
}
