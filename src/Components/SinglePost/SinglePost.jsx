import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Modal from '../Modal/Modal';
import UpdateComment from '../UpdateComment/UpdateComment';
import Deletecomment from '../DeleteComment/DeleteComment';


export default function SinglePost() {
	let { id } = useParams();
	const [dropdownOpen, setDropdownOpen] = useState(null)

	function toggleDropdown(postId) {
		setDropdownOpen(dropdownOpen === postId ? null : postId)
	}

	function getSinglePost() {
		return axios.get(`https://linked-posts.routemisr.com/posts/${id}`, {
			headers: {
				token: localStorage.getItem("token")
			}
		})
	}

	let { data, isError, isLoading, error } = useQuery({
		queryKey: ["singlePost"],
		queryFn: getSinglePost,
		select: (data) => data?.data?.post
	})

	if (isLoading) {
		return (
			<div className="flex flex-col gap-4 animate-pulse mx-auto mt-12 w-[60%]">
				<div className="flex items-center gap-4">
					<div className="bg-gray-700 h-16 w-16 shrink-0 rounded-full"></div>
					<div className="flex flex-col gap-4">
						<div className="bg-gray-700 h-4 w-20 rounded"></div>
						<div className="bg-gray-700 h-4 w-28 rounded"></div>
					</div>
				</div>
				<div className="bg-gray-700 h-[45vh] w-full rounded"></div>
			</div>

		);
	}

	return (
		<>
			{/* Post Box */}
			<div className="my-8 w-full md:w-[80%] lg:w-[60%] mx-auto bg-gradient-to-br from-purple-900 to-purple-800 text-white rounded-lg shadow-lg p-5 border border-purple-700">
				{/* User Info & Timestamp */}
				<div className="flex justify-between items-center mb-4">
					<div className="flex items-center gap-3">
						<img
							src={data?.user.photo}
							alt={data?.user.name}
							className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
						/>
						<div className="flex flex-col">
							<p className="font-medium">{data?.user.name}</p>
							<p className="text-sm text-purple-200">{new Date(data?.createdAt).toLocaleString()}</p>
						</div>
					</div>
				</div>


				{/* Post Body */}
				{data?.body && (
					<p className="mb-4 text-purple-100">{data.body}</p>
				)}

				{/* Post Image */}
				{data?.image && (
					<img
						src={data?.image}
						alt="Post"
						className="w-full max-h-[400px] object-cover rounded-md border border-purple-700"
					/>
				)}

				{/* Modal for Add Comment */}
				<Modal id={data?._id} />
			</div>

			{/* Comments Section */}
			<div className="w-full md:w-[80%] lg:w-[60%] mx-auto mt-4 space-y-4">
				<h2 className="text-xl font-semibold text-white mb-2">Comments</h2>
				{data?.comments?.map((comment) => (
					<div
						key={comment._id}
						className="p-3 rounded-md border border-purple-700 bg-purple-950 text-white"
					>
						<div className="flex justify-between items-center mb-4">
							<div className="flex items-center gap-3">
								<img
									src={comment.user?.photo}      // Assuming each comment has its own user info
									alt={comment.user?.name}
									className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
								/>
								<div className="flex flex-col">
									<p className="font-medium">{comment.user?.name}</p>
									<p className="text-sm text-purple-200">{new Date(comment.createdAt).toLocaleString()}</p>
								</div>
							</div>

							{/* Dropdown Menu */}
							<div className="relative">
								<button
									onClick={() => toggleDropdown(comment._id)}
									className="text-white cursor-pointer hover:text-gray-300 focus:outline-none text-xl"
								>
									⋯
								</button>

								{dropdownOpen === comment._id && (
									<div className="absolute right-0 mt-2 w-40 bg-black rounded-md shadow-lg z-50">
										<ul className="py-1 text-sm text-gray-200">
											<UpdateComment id={comment._id} onCloseDropdown={() => setDropdownOpen(null)} />
											<Deletecomment id={comment._id} onCloseDropdown={() => setDropdownOpen(null)} />
										</ul>
									</div>
								)}
							</div>
						</div>

						<p className="text-purple-100">{comment.content}</p>
					</div>
				))}
			</div>


		</>
	)
}
