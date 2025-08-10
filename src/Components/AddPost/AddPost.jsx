import React, { useState } from 'react'
import style from './AddPost.module.css'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'

export default function AddPost() {

  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient();

  const schema = z.object({
    body : z.string().min(1, "Post Can't Be Without Caption Or Image"),
    image : z.any("Post Can't Be Uploaded Without Image")
  })

  const form = useForm({
    defaultValues: {
      body : "",
      image : ""
    },
    resolver : zodResolver(schema)
  })

  const { register, handleSubmit, formState } = form;


  async function addPost(values) {
    try {
      setIsLoading(true)

      console.log(values.body);
      console.log(values.image[0]);
  
      let data = new FormData();
      data.append('body', values.body);
      data.append('image', values.image?.[0]);
  
      const res = await axios.post(
        `https://linked-posts.routemisr.com/posts`,data,{
          headers: {
            token: localStorage.getItem("token"),
          }
        }
      );
  
      toast.success('Post Added Successfully');
      queryClient.invalidateQueries(["getUserPosts"])
      form.reset();
    } catch (err) {
      toast.error('Cant Add Post, Try Again Please');
    } finally {
    setIsLoading(false)
  }
}

return (
  <div className="my-8 w-full md:w-[80%] lg:w-[60%] mx-auto bg-gradient-to-br from-purple-900 to-purple-800 text-white rounded-lg shadow-lg p-5 border border-purple-700">
    <form onSubmit={handleSubmit(addPost)}>
      <div className="relative mb-4">
        <label htmlFor="postText" className="block mb-2 text-sm font-medium">
          📄 What's on your mind?
        </label>
        <textarea
          id="postText"
          className="block w-full p-4 pr-16 pl-12 text-purple-200 bg-gray-900 rounded-lg border border-purple-700 focus:ring-purple-500 focus:border-purple-500 placeholder-purple-400 resize-none"
          placeholder="Write your post..."
          rows={4}
          {...register('body')}
          disabled={isLoading}
        />

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
      <p className='text-red-600 font-bold'>{formState.errors.body?.message}</p>
    </form>
  </div>
)
}