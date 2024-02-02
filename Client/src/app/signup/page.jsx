'use client'
import axios from 'axios';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { backend_url } from '../../../config';
import { useRouter } from 'next/navigation';


const SignupPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [formRole, setFormRole] = useState("");
    const roleArr = ["student", "teacher", "admin"]

    const router = useRouter()
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            toast.error("Please fill in all fields");
            return
        }
        // const role = formRole ? role : "student"
        // if (!roleArr.includes(role)) {
        //     toast.error("Role must be one of student, teacher or admin")
        //     return
        // }
        const sentData = { username, password, role: formRole }
        console.log(sentData)
        try {
            const res = await axios.post(`${backend_url}/register`, sentData)
            if (res.status === 200) {
                toast.success("User created successfully")
                // router.push("/dasboard")
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }
    }
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md">
                <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                            Username
                        </label>
                        <input
                            type="text"
                            id="name"
                            onChange={(e) => { setUsername(e.target.value) }}
                            value={username}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="role" className="block text-gray-700 font-bold mb-2">
                            Role
                        </label>
                        <input
                            type="text"
                            id="role"
                            onChange={(e) => { setFormRole(e.target.value) }}
                            value={formRole}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700 font-bold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => { setPassword(e.target.value) }}
                            value={password}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;
