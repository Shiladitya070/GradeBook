'use client'
import axios from "axios";
import { useEffect } from "react";
import { backend_url } from "../../config";
import { useCookies } from "react-cookie";


export default function Home() {

  const [cookies, setCookie, removeCookie] = useCookies();

  const fn = async () => {
    // const ping = await axios.get(`${backend_url}/ping`);
    // console.log("❤️", ping.data)
    const res = await axios.get(`${backend_url}/profile`, { headers: { Authorization: `${cookies.auth}` } });
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
    </div>
  );
}
