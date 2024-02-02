"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

function ListOfClass({ teacher }) {
    const router = useRouter()
    const { id, name } = teacher.
        const[classes, setClasses] = useState([{ className: "Mathematics", classCode: "MATH101" }, { className: "Physics", classCode: "PHY101" }])
    return (
        <div className="max-w-lg mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4">Classes Taught by {name}</h2>
            <ul className="divide-y divide-gray-300">
                {classes.map((classItem, index) => (
                    <li key={index} className="py-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <Link className="text-lg font-semibold" href={`/class/${classItem.classCode}`}>{classItem.className}</Link>
                            </div>
                            <span className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm">{classItem.classCode}</span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ListOfClass