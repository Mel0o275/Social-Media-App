import React, { useState } from 'react'
import style from './ChangeUserImage.module.css'
import { useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import axios from 'axios';


export default function ChangeUserImage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();


  const form = useForm({
    defaultValues: {
      image: ""
    },
  })

  const { register, handleSubmit, formState } = form;

  async function ChangeUserImage(values) {
    setIsLoading(true);
    try {

      console.log(values);
      const data = new FormData();
      if (values.image?.[0]) {
        data.append("photo", values.image[0])
      }

      const res = await axios.put(
        'https://linked-posts.routemisr.com/users/upload-photo',
        data,
        {
          headers: {
            token: localStorage.getItem('token'),
          },
        }
      );

      toast.success('Image updated successfully!');
      queryClient.invalidateQueries(['getUserPosts']);
      setIsOpen(false);
    } catch (err) {
      console.log(err);
      toast.error('Failed to update Image.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full shadow-md transition-colors cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        <i className="fa-solid fa-user-pen"></i>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-gradient-to-br from-purple-900 to-purple-800 rounded-2xl bg-opacity-60 flex justify-center items-center z-50 border-0"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-purple-900 p-6 rounded-lg shadow-lg max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white text-xl font-bold mb-4">Change Image</h3>
            <form
              onSubmit={handleSubmit(ChangeUserImage)}
              className="flex flex-col gap-4"
            >
              <div className="relative w-12 h-12">
                <label
                  htmlFor="img"
                  className={`absolute left-3 bottom-3 flex items-center justify-center w-6 h-6 rounded-md cursor-pointer transition-colors duration-200
                  ${isLoading
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-500 hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400'
                    }`}
                >
                </label>
                <input
                  type="file"
                  id="img"
                  accept="image/*"
                  {...register('image')}
                  disabled={isLoading}
                />
              </div>


              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white cursor-pointer"
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white cursor-pointer disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? 'Changing...' : 'Change'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}