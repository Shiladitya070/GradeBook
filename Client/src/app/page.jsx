'use client'
import axios from "axios";
import { useEffect } from "react";
import { useCookies } from "react-cookie";
import { backend_url } from "../../config";


export default function Home() {

  const [cookies, setCookie, removeCookie] = useCookies();
  console.log("🍪", cookies.auth)
  const fn = async () => {
    const ping = await axios.get(`${backend_url}/ping`)
    console.log(ping.data)
    const res = await axios.get(`${backend_url}/profile`, { headers: { Authorization: `${cookies.auth}` } });
    localStorage.setItem("user", res.data)

  }
  const checkBk = async () => {
    const res = await axios.get(`api/testai`)
    console.log(res.data)
  }
  useEffect(() => {
    fn()

  }, []);
  return (
    <div>
      <h1>
        GradeBook h1
      </h1>
      <button className="bg-red-600 " onClick={checkBk}>Click</button>
    </div>
  );
}
