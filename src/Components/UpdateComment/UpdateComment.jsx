import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'

export default function UpdateComment({ id, onCloseDropdown }) {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const queryClient = useQueryClient()

  const schema = z.object({
    content: z.string().min(1, "Comment Can't Be Empty"),
  })

  const form = useForm({
    defaultValues: {
      content: "",
    },
    resolver: zodResolver(schema)
  })

  const { register, handleSubmit, formState } = form;


  async function updateComment(values) {
    setIsLoading(true)
    try {
      console.log(values)

      const res = await axios.put(
        `https://linked-posts.routemisr.com/comments/${id}`,
        values,
        {
          headers: {
            token: localStorage.getItem("token")
          },
        }
      )

      console.log(res)
      onCloseDropdown(false)
      toast.success("Comment updated successfully!")
      queryClient.invalidateQueries(["getUserPosts"])
      setIsModalOpen(false)
    } catch (err) {
      console.error(err)
      toast.error("Failed to update comment.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <li>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="block px-4 py-2 hover:bg-purple-900 w-full text-left cursor-pointer"
      >
        Update
      </button>
  
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-gradient-to-br from-purple-900 to-purple-800 p-5 rounded-lg shadow-lg w-[90%] max-w-lg border border-purple-700 text-white relative">
            {/* Close button */}
            <button
              onClick={() => {
                setIsModalOpen(false);
                onCloseDropdown(false);
              }}
              className="absolute top-3 right-3 text-gray-300 hover:text-white text-xl cursor-pointer"
              disabled={isLoading}
            >
              ✕
            </button>
  
            {/* Title */}
            <h2 className="text-xl font-semibold mb-4">Update comment</h2>
  
            {/* Form */}
            <form onSubmit={handleSubmit(updateComment)}>
              <div className="relative mb-4">
                <label
                  htmlFor="postText"
                  className="block mb-2 text-sm font-medium"
                >
                  📄 What's on your mind?
                </label>
  
                <textarea
                  id="postText"
                  className="block w-full p-4 pr-16 pl-12 text-white border rounded-lg bg-black focus:ring-purple-500 focus:border-purple-500 resize-none"
                  rows={4}
                  {...register("content", { required: "Comment cannot be empty" })}
                  disabled={isLoading}
                />
  
                {/* Send Button */}
                <button
                  type="submit"
                  className={`cursor-pointer absolute right-3 bottom-3 ${
                    isLoading
                      ? "text-gray-400"
                      : "text-gray-500 hover:text-purple-500"
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
              {formState.errors.content && (
                <p className="text-red-500 font-medium">
                  {formState.errors.content.message}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </li>
  );
  
}