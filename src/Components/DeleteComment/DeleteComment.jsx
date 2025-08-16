import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';

export default function Deletecomment({ id, onCloseDropdown }) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  async function deleteComment() {
    setIsLoading(true);
    try {
      const res = await axios.delete(
        `https://linked-posts.routemisr.com/comments/${id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );

      console.log(res);
      onCloseDropdown(false);
      toast.success("Comment deleted successfully!");
      queryClient.invalidateQueries(["getUserPosts"]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete comment.");
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
        onClick={deleteComment}
        disabled={isLoading}
      >
        {isLoading ? "Deleting..." : "Delete"}
      </button>
    </li>
  );
  
}
