import React, { useState } from 'react'
import style from './UpdatePost.module.css'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'

export default function UpdatePost({ id, caption, onCloseDropdown }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient()

  const schema = z.object({
    body: z.string().min(1, "Post Can't Be Without Caption Or Image"),
    image: z.any("Post Can't Be Uploaded Without Image")
  })

  const form = useForm({
    defaultValues: {
      body: "",
      image: ""
    },
    resolver: zodResolver(schema)
  })

  const { register, handleSubmit, formState } = form;


  async function updatePost(values) {
    setIsLoading(true)
    try {
      console.log(values.body)
      console.log(values.image?.[0])

      const data = new FormData()
      data.append("body", values.body)
      if (values.image?.[0]) {
        data.append("image", values.image[0])
      }

      const res = await axios.put(
        `https://linked-posts.routemisr.com/posts/${id}`,
        data,
        {
          headers: {
            token: localStorage.getItem("token")
          },
        }
      )

      console.log(res)
      onCloseDropdown(false)
      toast.success("Post updated successfully!")
      queryClient.invalidateQueries(["getUserPosts"])
      setIsModalOpen(false)
    } catch (err) {
      console.error(err)
      toast.error("Failed to update post.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <li>
      <button
        onClick={() => setIsModalOpen(true)}
        className="block px-4 py-2 hover:bg-purple-900 w-full text-left cursor-pointer"
      >
        Update
      </button>
  
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 bg-gradient-to-br from-black">
          <div className="bg-gradient-to-br from-purple-900 to-purple-800 p-5 rounded-lg shadow-lg w-[90%] max-w-lg border border-purple-700 text-white relative">
            {/* Close button */}
            <button
              onClick={() => {
                setIsModalOpen(false)
                onCloseDropdown(false)
              }}
              className="absolute top-3 right-3 text-gray-300 hover:text-white text-xl cursor-pointer"
              disabled={isLoading}
            >
              ✕
            </button>
  
            <h2 className="text-xl font-semibold mb-4">Update Post</h2>
  
            <form onSubmit={handleSubmit(updatePost)}>
              <div className="relative mb-4">
                <label htmlFor="postText" className="block mb-2 text-sm font-medium">
                  📄 What's on your mind?
                </label>
                <textarea
                  id="postText"
                  className="block w-full p-4 pr-16 pl-12 text-white border rounded-lg bg-black focus:ring-purple-500 focus:border-purple-500 resize-none"
                  rows={4}
                  {...register('body')}
                  defaultValue={caption}
                  disabled={isLoading}
                />
  
                {/* Image Upload Icon */}
                <label
                  htmlFor="img"
                  className={`absolute left-3 bottom-3 cursor-pointer ${
                    isLoading ? 'text-gray-400' : 'text-gray-500 hover:text-purple-500'
                  }`}
                >
                  <i className="fa-solid fa-image text-lg"></i>
                </label>
                <input
                  type="file"
                  id="img"
                  className="hidden"
                  accept="image/*"
                  {...register('image')}
                  disabled={isLoading}
                />
  
                {/* Send Button Icon */}
                <button
                  type="submit"
                  className={`cursor-pointer absolute right-3 bottom-3 ${
                    isLoading ? 'text-gray-400' : 'text-gray-500 hover:text-purple-500'
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <i className="fas fa-spinner fa-spin text-lg"></i>
                  ) : (
                    <i className="fa-solid fa-paper-plane text-lg"></i>
                  )}
                </button>
              </div>
  
              {/* Error message */}
              <p className="text-red-600 font-bold">{formState.errors.body?.message}</p>
            </form>
          </div>
        </div>
      )}
    </li>
  )
  
}