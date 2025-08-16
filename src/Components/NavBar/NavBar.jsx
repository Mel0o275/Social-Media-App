import React, { useState, useContext } from 'react';
import style from './NavBar.module.css';
import { UserContext } from '../../Context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function NavBar() {
	let navigate = useNavigate();
	let { userLogin, setuserLogin } = useContext(UserContext);

	const [dropdownOpen, setDropdownOpen] = useState(false);

	function signOut() {
		localStorage.removeItem('token');
		setuserLogin(null);
		navigate('/login');
	}

	const { data, isError, error, isLoading } = useQuery({
		queryKey: ['userData'],
		queryFn: () =>
			axios.get(`https://linked-posts.routemisr.com/users/profile-data`, {
				headers: { token: localStorage.getItem('token') },
			}),
		enabled: !!userLogin,
	});

	if (isError) {
		return <h2 className="text-red-400 text-center mt-10 text-lg">{error.message}</h2>;
	}

	const user = data?.data?.user;

	return (
		<nav className="bg-gradient-to-br from-purple-900 to-black border-gray-200 dark:bg-gray-900 fixed z-50 top-0 left-0 right-0">
			<div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
				<Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
					<i className="fa-brands fa-bluesky text-white text-3xl"></i>
					<span className="text-2xl font-semibold whitespace-nowrap dark:text-white">Melonista</span>
				</Link>
				<div className="flex items-center space-x-4">
					{userLogin !== null ? (
						<div className="relative">
							<button
								type="button"
								onClick={() => setDropdownOpen(!dropdownOpen)}
								className="cursor-pointer flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
								id="user-menu-button"
								aria-expanded={dropdownOpen}
								aria-haspopup="true"
							>
								<span className="sr-only">Open user menu</span>
								<div className="w-15 h-15 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 flex items-center justify-center">
									<img src={user?.photo} alt={user?.name} />
								</div>
							</button>

							{dropdownOpen && (
								<div
									className="z-50 absolute right-0 mt-2 w-48 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
									id="user-dropdown"
								>
									<div className="px-4 py-3">
										<span className="block text-sm text-gray-900 dark:text-white">{user.name}</span>
										<span className="block text-sm text-gray-500 truncate dark:text-gray-400">{user.email}</span>
									</div>
									<ul className="py-2" aria-labelledby="user-menu-button">
										<li>
											<Link
												to="/profile"
												className="cursor-pointer mb-1 flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
											>
												<i className="fa-solid fa-user me-2"></i>Profile
											</Link>
										</li>
										<li>
											<button
												onClick={signOut}
												className="w-full text-left cursor-pointer flex items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
											>
												<i className="fa-solid fa-arrow-right-from-bracket me-2"></i>Sign out
											</button>
										</li>
									</ul>
								</div>
							)}
						</div>
					) : (
						<div className="flex space-x-2">
							<Link
								to={'/register'}
								className="cursor-pointer relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
							>
								<span className="cursor-pointer relative px-5 py-2.5 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent transition-all duration-75">
									Register
								</span>
							</Link>
							<Link
								to={'/login'}
								className="cursor-pointer relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
							>
								<span className="relative px-5 py-2.5 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent transition-all duration-75">
									Login
								</span>
							</Link>
						</div>

					)}
				</div>
			</div>
		</nav>
	);

}
