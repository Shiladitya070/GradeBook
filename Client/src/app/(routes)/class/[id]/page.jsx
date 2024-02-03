'use client'

import { useParams } from "next/navigation";

const calculateDaysLeft = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const differenceInTime = due.getTime() - today.getTime();
    const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

    return differenceInDays >= 0 ? differenceInDays : 'Past Due';
};

const ClassPage = () => {

    const { id } = useParams();
    const classId = id;

    const classData = {
        id: classId,
        className: 'Mathematics',
        teacher: 'Mr. Smith',
        description: 'Introduction to algebra and calculus',
        students: ['John Doe', 'Jane Doe', 'Alice Smith'],
        assignments: [
            {
                id: 1,
                title: 'Assignment 1',
                dueDate: '2024-02-10',
                submitted: true,
                reviewStatus: 'Pending',
                grade: null
            },
            {
                id: 2,
                title: 'Assignment 2',
                dueDate: '2024-02-15',
                submitted: false,
                reviewStatus: null,
                grade: null
            }
        ]
    };

    if (!classData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto mt-8 p-4">
            <h1>ID:{classId}</h1>
            <h1 className="text-3xl font-bold mb-4">{classData.className}</h1>
            <p className="text-gray-600 mb-4">Teacher: {classData.teacher}</p>
            <p className="mb-4">{classData.description}</p>

            <h2 className="text-xl font-bold mb-2">Enrolled Students:</h2>
            <ul className="list-disc ml-4 mb-4">
                {classData.students.map((student, index) => (
                    <li key={index}>{student}</li>
                ))}
            </ul>

            <h2 className="text-xl font-bold mt-4 mb-2">Assignments:</h2>
            <ul>
                {classData.assignments.map(assignment => (
                    <li key={assignment.id} className="mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
                        <div>
                            <p className="font-semibold text-indigo-600">
                                <a
                                    href={`/class/asg/${assignment.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    {assignment.title}
                                </a>
                            </p>
                            <p className="text-gray-700">Due Date: {assignment.dueDate}</p>
                            <p className="text-gray-700">Submission Status: {assignment.submitted ? <span className="text-green-600">Submitted</span> : <span className="text-red-600">Not Submitted</span>}</p>
                            {assignment.submitted && (
                                <>
                                    <p className="text-gray-700">Review Status: {assignment.reviewStatus ? assignment.reviewStatus : 'Pending'}</p>
                                    {assignment.reviewStatus === 'Reviewed' && (
                                        <p className="text-gray-700">Grade: {assignment.grade ? assignment.grade : 'Not graded yet'}</p>
                                    )}
                                </>
                            )}
                            {!assignment.submitted && (
                                <p className="text-white font-bold bg-blue-500 w-fit text p-1 rounded-lg">Days Left: {calculateDaysLeft(assignment.dueDate)}</p>
                            )
                            }
                        </div>
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default ClassPage;
