'use client'
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";
import { backend_url } from "../../../config";


const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [setCookie] = useCookies(['auth']);

    const router = useRouter()
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) {
            toast.error("Please fill in all fields");
            return
        }
        const sentData = { username, password }
        console.log(sentData)
        try {
            const res = await axios.post(`${backend_url}/cred/verify`, sentData)
            if (res.status === 200) {
                toast.success("User created successfully")
                if (!res.data) {
                    setCookie("auth", res.data, { path: "/" });
                }
                router.push("/dasboard")
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }
    }
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded px-8 py-6">
                <h2 className="text-2xl font-bold mb-6">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="Username">
                            Username
                        </label>
                        <input
                            value={username}
                            onChange={(e) => { setUsername(e.target.value) }}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="Username"
                            type="Username"
                            placeholder="Enter your Username"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Sign In
                        </button>
                        <a
                            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                            href="#"
                        >
                            Forgot Password?
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
