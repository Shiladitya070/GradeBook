'use client'
import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'



function Page() {
    const [data, setData] = useState([])
    console.log("🍪🍪", data)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await axios.get('api/viewSubmission')
                console.log(result.data)
                const { submissions } = result.data
                setData(submissions)
            } catch (error) {
                console.log(error)
            }
        }
        fetchData()
    }, [])
    if (data.length <= 0) {
        return <h1>No Submission</h1>
    }

    return (
        <div>
            <h1>Your Submission</h1>
            {data.map(({ _id }) => (
                <div>
                    <Link className='border-b bg-red-400 p-2' href={`/check/${_id}`}>{_id}</Link>
                </div>
            ))}
        </div>
    )
}

export default Page