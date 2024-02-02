'use client'
import axios from "axios";
import { useEffect } from "react";
import { backend_url } from "../../config";

export default function Home() {
  const fn = async () => {
    const res = await axios.get(`${backend_url}/test`)
    console.log(res.data)
  }
  useEffect(() => {
    fn()
  }, []);
  return (
    <div>
      <h1>
        GradeBook
      </h1>
    </div>
  );
}
