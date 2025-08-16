import React, { useState } from 'react';
import style from './DeletePost.module.css';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

export default function DeletePost({ id, onCloseDropdown }) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  async function deletePost() {
    setIsLoading(true);
    try {
      const res = await axios.delete(
        `https://linked-posts.routemisr.com/posts/${id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      console.log(res);
      onCloseDropdown(false);
      toast.success("Post deleted successfully!");
      queryClient.invalidateQueries(["getUserPosts"]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete post.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <li className="w-full">
      <button
        className={`block px-3 sm:px-4 py-2 w-full text-left text-sm sm:text-base cursor-pointer hover:bg-purple-900 rounded transition-colors ${
          isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={deletePost}
        disabled={isLoading}
      >
        {isLoading ? "Deleting..." : "Delete"}
      </button>
    </li>
  );
  
}
