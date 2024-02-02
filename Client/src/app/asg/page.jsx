'use client'
import React, { useEffect, useState } from 'react';
const fetchClasses = async () => {
    try {
        // Fetch classes from the API
        const response = await fetch('your-api-endpoint-for-classes');
        const data = await response.json();
        // Set the list of classes in state
        setClassList(data.classes);
    } catch (error) {
        console.error('Error fetching classes:', error);
    }
};

const CreateAssignmentForm = ({ onCreate }) => {
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [classList, setClassList] = useState(["maths", "science", "english"]);
    useEffect(() => {
        // Simulate fetching classes (replace with actual API call)
        fetchClasses();
    }, []);


    const handleSubmit = (event) => {
        event.preventDefault();
        // Basic validation
        if (!title || !dueDate) {
            alert('Please fill in all fields.');
            return;
        }
        // Create assignment object
        const newAssignment = {
            title: title,
            dueDate: dueDate,
            submitted: false,
            reviewStatus: null,
            grade: null
        };
        // Pass the new assignment to the parent component
        onCreate(newAssignment);
        // Reset form fields
        setTitle('');
        setDueDate('');
    };

    return (
        <form onSubmit={handleSubmit} className=' w-screen h-screen flex flex-col justify-center items-center container '>
            <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title:</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="classSelect" className="block text-gray-700 font-bold mb-2">Select Class:</label>
                <select
                    id="classSelect"
                    name="classSelect"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                >
                    <option value="">Select a class...</option>
                    {/* Populate options dynamically based on classes */}
                    {classList.map((classItem, index) => (
                        <option key={index} value={classItem}>{classItem}</option>
                    ))}
                </select>
            </div>
            <div className="mb-4">
                <label htmlFor="dueDate" className="block text-gray-700 font-bold mb-2">Due Date:</label>
                <input
                    type="date"
                    id="dueDate"
                    name="dueDate"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                />
            </div>
            <button
                type="submit"
                className="bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
            >
                Create Assignment
            </button>
        </form>
    );
};

export default CreateAssignmentForm;
