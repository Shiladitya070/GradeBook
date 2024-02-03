'use client'
import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

const NavBar = ({ className = "" }) => {
    if (!window) {
        return null;
    }
    const [cookies, setCookie, removeCookie] = useCookies();
    const [token, setToken] = useState("")
    useEffect(() => {
        setToken(localStorage.getItem('user'))
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('user');
        removeCookie('auth', { path: '/' })
        window.location.href = '/login'

    };

    return (
        <nav className={`bg-gray-800 ${className}`}>
            <ul className="flex items-center justify-between px-4 py-2">
                <li>
                    <a href="/" className="text-white font-bold text-lg">Home</a>
                </li>
                <div className='flex'>

                    {token ? (
                        <>
                            <li>
                                <a href="/profile" className="text-white hover:text-gray-300 ml-4">Profile</a>
                            </li>
                            <li>
                                <button onClick={handleLogout} className="text-white hover:text-gray-300 ml-4">Logout</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <a href="/login" className="text-white hover:text-gray-300 ml-4">Login</a>
                            </li>
                            <li>
                                <a href="/signup" className="text-white hover:text-gray-300 ml-4">Signup</a>
                            </li>
                        </>
                    )}
                </div>
            </ul>
        </nav>
    );
};

export default NavBar;
