import React, { useState } from 'react';
import style from './Modal.module.css';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast';



export default function Modal({ id }) {
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient();

  const schema = z.object({
    content: z.string().min(1, "Comment Can't be empty").max(500, "Comment must be less than 500 characters"),
    post: z.string().nonempty("Post ID is required")
  });

  const [isShow, setIsShow] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm({
    defaultValues: {
      content: "",
      post: id
    },
    resolver: zodResolver(schema)
  });

  const { register, handleSubmit, formState, reset } = form;

  async function addComment(values) {
    setIsLoading(true)
    try {
      const res = await axios.post(
        `https://linked-posts.routemisr.com/comments`,
        values,
        {
          headers: {
            token: localStorage.getItem("token")
          }
        }
      );

      if (res.data.message === "success") {
        toast.success('Post Added Successfully');
        queryClient.invalidateQueries(["getUserPosts"])
        console.log(res.data.comment);
        reset();
        setTimeout(() => setShowSuccess(false), 5000);
      }
    } catch (err) {
      toast.error('Cant Add Post, Try Again Please');
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="addComment mt-5">
        {/* Banner */}
        {showSuccess && (
          <div className="mb-4 px-4 py-2 bg-black border border-purple-700 text-purple-300 rounded-lg text-center shadow-md transition-opacity duration-300">
            ✅ Comment added successfully!
          </div>
        )}
  
        <form onSubmit={handleSubmit(addComment)} noValidate className="w-full">
          <input type="hidden" {...register("post")} value={id} />
  
          <label htmlFor="chat" className="sr-only">
            Your message
          </label>
  
          <div className="flex items-center px-3 py-2 rounded-lg bg-black border border-purple-700">
            <textarea
              id="chat"
              rows="1"
              {...register("content")}
              className="block mx-2 md:mx-4 p-2.5 w-full text-sm text-purple-200 bg-gray-900 rounded-lg border border-purple-700 focus:ring-purple-500 focus:border-purple-500 placeholder-purple-400 resize-none"
              placeholder="Your comment..."
            ></textarea>
  
            <button
              type="submit"
              className={`inline-flex justify-center p-2 text-purple-500 rounded-full cursor-pointer hover:bg-purple-800 transition ${
                isLoading
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:text-purple-400"
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
  
          {formState.errors.content && formState.touchedFields.content && (
            <p className="text-red-500 text-center mt-2">
              {formState.errors.content.message}
            </p>
          )}
        </form>
      </div>
    </>
  );
  
}
