import React, { useState, useContext, useEffect } from 'react'
import style from './Home.module.css'
import { PostContext } from '../../Context/PostContext'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Modal from '../Modal/Modal'
import AddPost from '../AddPost/AddPost'



export default function Home() {

	function getAllPosts() {
		return axios.get('https://linked-posts.routemisr.com/posts?limit=50',
			{
				headers: {
					token: localStorage.getItem('token')
				},
			})
	}


	let { data, isError, error, isLoading } = useQuery({
		queryKey: ["getPosts"],
		queryFn: getAllPosts,
		staleTime: 25000,
		// gcTime : 5000,
		select: (data) => data?.data?.posts
		// retry : 5,
		// retryDelay : 3000
		// refetchInterval : 3000,
		// refetchIntervalInBackground : true
		// refetchOnWindowFocus :true
	})

	console.log(data);


	if (isError) {
		return <h2 className='text-white'>{error.message}</h2>
	}

	if (isLoading) {
		return (
			<div className="flex flex-col gap-4 animate-pulse mx-auto w-[60%] mt-0">
				<div className="flex items-center gap-4">
					<div className="bg-gray-700 h-16 w-16 shrink-0 rounded-full"></div>
					<div className="flex flex-col gap-4">
						<div className="bg-gray-700 h-4 w-20 rounded"></div>
						<div className="bg-gray-700 h-4 w-28 rounded"></div>
					</div>
				</div>
				<div className="bg-gray-700 h-[45vh] w-full rounded"></div>
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




	// let { getPosts } = usemontext(PostContext);
	// const [Posts, setPosts] = useState([])

	// async function getPost() {
	// 	let response = await getPosts();
	// 	console.log(response);
	// 	if (response.length) {
	// 		setPosts(response);
	// 		console.log(response);
	// 	}
	// }

	// useEffect(() => {
	// 	// getPost()
	// }, [])


	return <>

		<AddPost />

		{data?.map((post) => (
			<>

				<div
					className="my-8 w-full md:w-[80%] lg:w-[60%] mx-auto bg-gradient-to-br from-purple-900 to-purple-800 text-white rounded-lg shadow-lg p-5 border border-purple-700"
				>
					<Link key={post._id} to={`/singlepost/${post.id}`}>
						{/* User Info & Timestamp */}
						<div className="flex justify-between items-center mb-4">
							<div className="flex items-center gap-3">
								<img
									src={post.user.photo}
									alt={post.user.name}
									className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
								/>
								<div className="flex flex-col">
									<p className="font-medium">{post.user.name}</p>
									<p className="text-xs text-gray-300">{new Date(post.createdAt).toLocaleString()}</p>
								</div>
							</div>
						</div>

						{post.body && (
							<p className="mb-4 text-gray-100">{post.body}</p>
						)}

						{post.image && (
							<img
								src={post.image}
								alt="Post"
								className="w-full max-h-[400px] object-cover rounded-md border border-purple-700"
							/>
						)}
					</Link>

					<div className="flex gap-3 mt-5 justify-center">
						<Link
							key={post._id}
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

			</>
		))}


	</>
}
