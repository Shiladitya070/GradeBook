'use client'
import axios from 'axios';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { backend_url } from '../../config'
import { useCookies } from 'react-cookie';


function CreateClass() {
    const [className, setclassName] = useState("")
    const [cookies, setCookie, removeCookie] = useCookies();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await axios.post(`${backend_url}/teacher/class/create`, { class_name: className, headers: { Authorization: `${cookies.auth}` } })
        if (res.status === 200) {
            console.log(res.data)
            toast.success('class created successfully')
        }
    }

    return (
        <div>
            <form className="max-w-sm mx-auto mt-8 p-4 bg-gray-100 rounded-lg shadow-md" onSubmit={handleSubmit}>
                <label htmlFor="className" className="block text-gray-700 font-bold mb-2">Class Name:</label>
                <input
                    type="text"
                    name="className"
                    placeholder="Please enter class name"
                    value={className}
                    onChange={(e) => setclassName(e.target.value)}
                    className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
                <button type="submit" className="w-full mt-4 bg-indigo-500 text-white font-semibold p-2 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">
                    Create
                </button>
            </form>
        </div>
    )
}

export default CreateClass