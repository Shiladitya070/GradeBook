'use client'
import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const calculateDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const differenceInTime = due.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    return differenceInDays >= 0 ? differenceInDays : 'Past Due';
};

function Page() {
    const [assigments, setAssignments] = useState([])
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const feacthData = async () => {
            const res = await axios.get('api/getAllAsg')
            if (res.status === 200) {
                console.log(res.data)
                setAssignments(res.data.assigments)
                setLoading(false)
                console.log(assigments)
            }
        }
        feacthData()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div className='px-4'>
            <h2 className="text-xl font-bold mt-4 mb-2">Assignments:</h2>
            <ul>
                {assigments.length > 0 && assigments.map((assignment) => (
                    <li key={assignment.id} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
                        <div>
                            <p className="font-semibold text-indigo-600">
                                <Link
                                    href={`/asg/${assignment.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    {assignment.title}
                                </Link>
                            </p>
                            <p className="text-gray-700">Due Date: {assignment.dueDate}</p>
                            {/* <p className="text-gray-700">Submission Status: {assignment.submitted ? <span className="text-green-600">Submitted</span> : <span className="text-red-600">Not Submitted</span>}</p> */}


                            <p className="text-white font-bold bg-blue-500 w-fit text p-1 rounded-lg">Days Left: {calculateDaysLeft(assignment.dueDate)}</p>


                        </div>
                    </li>
                ))}
            </ul>
        </div>)
}

export default Page