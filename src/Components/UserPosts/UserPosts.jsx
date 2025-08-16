import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Link } from 'react-router-dom'
import UpdatePost from '../UpdatePost/UpdatePost'
import DeletePost from '../DeletePost/DeletePost'

export default function UserPosts() {

	const [dropdownOpen, setDropdownOpen] = useState(null)

	function toggleDropdown(postId) {
		setDropdownOpen(dropdownOpen === postId ? null : postId)
	}

	function getUserPosts() {
		return axios.get(`https://linked-posts.routemisr.com/users/664bcf3e33da217c4af21f00/posts`, {
			headers: {
				token: localStorage.getItem("token")
			}
		})
	}

	const { data, isError, error, isLoading } = useQuery({
		queryKey: ["getUserPosts"],
		queryFn: getUserPosts
	})

	if (isLoading) return <p>Loading posts...</p>
	if (isError) return <p>Error loading posts: {error.message}</p>

	return (
		<>
			{data?.data?.posts.map((post) => (
				<div
					key={post._id}
					className="relative my-8 w-full md:w-[80%] lg:w-[60%] mx-auto bg-gradient-to-br from-purple-900 to-purple-800 text-white rounded-lg shadow-lg p-5 border border-purple-700"
				>
					{/* User Info */}
					<div className="flex justify-between items-center mb-4">
						<div className="flex items-center gap-3">
							<img
								src={post.user.photo}
								alt={post.user.name}
								className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
							/>
							<div className="flex flex-col">
								<p className="font-medium">{post.user.name}</p>
								<p className="text-xs text-gray-300">
									{new Date(post.createdAt).toLocaleString()}
								</p>
							</div>
						</div>

						{/* 3 Dots Dropdown */}
						<div className="relative">
							<button
								onClick={() => toggleDropdown(post._id)}
								className="text-white cursor-pointer hover:text-gray-300 focus:outline-none text-xl"
							>
								⋯
							</button>

							{dropdownOpen === post._id && (
								<div className="absolute right-0 mt-2 w-40 bg-black rounded-md shadow-lg z-50">
									<ul className="py-1 text-sm text-gray-200">
										<UpdatePost
											id={post._id}
											caption={post.body}
											onCloseDropdown={() => setDropdownOpen(null)}
										/>
										<DeletePost
											id={post._id}
											onCloseDropdown={() => setDropdownOpen(null)}
										/>
									</ul>
								</div>
							)}
						</div>
					</div>

					{/* Post Content */}
					<Link to={`/singlepost/${post._id}`}>
						{post.body && <p className="mb-4 text-gray-100">{post.body}</p>}

						{post.image && (
							<img
								src={post.image}
								alt="Post"
								className="w-full max-h-[400px] object-cover rounded-md border border-purple-700"
							/>
						)}
					</Link>

					{/* Add Comment Button */}
					<div className="flex gap-3 mt-5 justify-center">
						<Link
							to={`/singlepost/${post._id}`}
							className="cursor-pointer relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
						>
							<span className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent transition-all duration-300">
								<i className="fa-solid fa-comment-dots text-gray-900 dark:text-white"></i>
								Add Comment
							</span>
						</Link>
					</div>
				</div>
			))}
		</>
	);

}
