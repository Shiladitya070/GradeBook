'use client'
import React, { useEffect, useState } from 'react';

const NavBar = ({ className = "" }) => {
    const [token, setToken] = useState("")
    useEffect(() => {
        setToken(localStorage.getItem('token'))
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('token');
        // Perform any additional logout logic here
    };

    return (
        <nav className={`bg-gray-800 ${className}`}>
            <ul className="flex items-center justify-between px-4 py-2">
                <li>
                    <a href="/" className="text-white font-bold text-lg">Home</a>
                </li>
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
            </ul>
        </nav>
    );
};

export default NavBar;
