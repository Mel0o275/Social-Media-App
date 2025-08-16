import React, { useState } from "react";
import style from "./Home.module.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import AddPost from "../AddPost/AddPost";
import UpdatePost from "../UpdatePost/UpdatePost";
import DeletePost from "../DeletePost/DeletePost";

export default function Home() {
	const [dropdownOpen, setDropdownOpen] = useState(null);

	function getAllPosts() {
		return axios.get("https://linked-posts.routemisr.com/posts?limit=50", {
			headers: {
				token: localStorage.getItem("token"),
			},
		});
	}

	const {
		data: posts,
		isError: isPostsError,
		error: postsError,
		isLoading: isPostsLoading,
	} = useQuery({
		queryKey: ["getPosts"],
		queryFn: getAllPosts,
		staleTime: 25000,
		select: (data) => data?.data?.posts,
	});

	function GetUserData() {
		return axios.get(`https://linked-posts.routemisr.com/users/profile-data`, {
			headers: {
				token: localStorage.getItem("token"),
			},
		});
	}

	const {
		data: userData,
		isError: isUserError,
		error: userError,
		isLoading: isUserLoading,
	} = useQuery({
		queryKey: ["userData"],
		queryFn: GetUserData,
		select: (data) => data?.data?.user,
	});

	if (isPostsError || isUserError) {
		return (
			<h2 className="text-red-400 text-center mt-10 text-lg">
				{postsError?.message || userError?.message}
			</h2>
		);
	}

	if (isPostsLoading || isUserLoading) {
		return <>
			<div className="flex flex-col gap-4 animate-pulse mx-auto w-[60%] mt-0">
				<div className="flex items-center gap-4">
					<div className="bg-gray-700 h-16 w-16 shrink-0 rounded-full"></div>
					<div className="flex flex-col gap-4">
						<div className="bg-gray-700 h-4 w-20 rounded"></div>
						<div className="bg-gray-700 h-4 w-28 rounded"></div>
					</div>
				</div>
				<div className="bg-gray-700 h-[45vh] w-full rounded"></div>
			</div>

			<div className="flex flex-col gap-4 animate-pulse mx-auto w-[60%] mt-0 py-4">
				<div className="flex items-center gap-4">
					<div className="bg-gray-700 h-16 w-16 shrink-0 rounded-full"></div>
					<div className="flex flex-col gap-4">
						<div className="bg-gray-700 h-4 w-20 rounded"></div>
						<div className="bg-gray-700 h-4 w-28 rounded"></div>
					</div>
				</div>
				<div className="bg-gray-700 h-[45vh] w-full rounded"></div>
			</div>
		</>
	}

	return (
		<>
			<AddPost />
	
			{posts?.map((post) => (
				<div
					key={post._id}
					className="relative my-8 w-full sm:w-[95%] md:w-[80%] lg:w-[60%] mx-auto bg-gradient-to-br from-purple-900 to-purple-800 text-white rounded-lg shadow-lg p-5 border border-purple-700"
				>
					{/* Post Header */}
					<div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-3">
						<div className="flex items-center gap-3">
							<img
								src={post.user.photo}
								alt={post.user.name}
								className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
							/>
							<div className="flex flex-col">
								<p className="font-medium">{post.user.name}</p>
								<p className="text-xs text-gray-300 break-all">
									{new Date(post.createdAt).toLocaleString()}
								</p>
							</div>
						</div>
	
						{userData?._id === post.user._id && (
							<div className="relative self-end sm:self-auto">
								<button
									onClick={() =>
										setDropdownOpen(dropdownOpen === post._id ? null : post._id)
									}
									className="p-2 rounded-full hover:bg-purple-700"
								>
									<i className="fa-solid fa-ellipsis-vertical"></i>
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
						)}
					</div>
	
					{/* Post Body */}
					{post.body && (
						<p className="mb-4 text-gray-100 break-words">{post.body}</p>
					)}
	
					{post.image && (
						<img
							src={post.image}
							alt="Post"
							className="w-full max-h-[400px] object-cover rounded-md border border-purple-700"
						/>
					)}
	
					{/* Add Comment Button */}
					<div className="flex gap-3 mt-5 justify-center">
						<Link
							to={`/singlepost/${post.id}`}
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
