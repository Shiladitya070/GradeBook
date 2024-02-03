'use client'
import axios from "axios";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { backend_url } from "../../config";
import ActivityLog from '../components/ActivityLog'
import { useRouter } from "next/navigation";

async function pingBack() {
  const ping = await axios.get(`${backend_url}/ping`)
  console.log(ping.data)
}

export default function Home() {
  const router = useRouter()
  const [cookies, setCookie, removeCookie] = useCookies();
  const [Loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"))
  console.log("👏👏", user)
  const fn = async () => {
    try {
      console.log(cookies.auth)
      const res = await axios({ method: 'get', url: `${backend_url}/profile`, headers: { 'Authorization': `${cookies.auth}` } })
      console.log(res.data)
      localStorage.setItem("user", JSON.stringify(res.data))
      setLoading(false)
    } catch (error) {
      console.log(error)
      router.push("/login")
    }
  }
  const checkBk = async () => {
    const res = await axios.get(`api/testai`)
    console.log(res.data)
  }
  const activities = [
    { timestamp: "2024-02-02 10:00:00", studentName: "John Doe", action: "Submitted assignment" },
    { timestamp: "2024-02-02 10:15:00", studentName: "Jane Smith", action: "Viewed lecture slides" },
    // Add more activities as needed
  ];
  useEffect(() => {
    fn()
    pingBack()

  }, []);
  const htmlForStudents = (
    <div className="flex">

      <h1>
        {/* {user.username} */}
        this is for students
      </h1>

    </div>
  )

  const htmlForTeachers = (
    <div className="flex">
      <ActivityLog activities={activities} className="flex-grow  w-full" />
    </div>
  )
  if (Loading) {
    return <div>Loading...</div>
  }
  return (

    <div className="flex">
      {user.role === "student" ? htmlForStudents : htmlForTeachers}
    </div>
  );
}
