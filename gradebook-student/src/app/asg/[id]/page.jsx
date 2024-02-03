'use client'
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const viewAsg = () => {
    const { id } = useParams();
    const [asg, setAsg] = useState();
    const [loading, setLoading] = useState(true);
    const [formData, setForm] = useState({});
    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const list = [...formData];
        list[index][name] = value;
        setFormData(list);
    };
    const handleSubmit = async event => {
        event.preventDefault();
        console.log("Form Data", formData);

        const dataToSend = {
            id: asg.id, // Assuming asg.id is defined elsewhere
            className: asg.className,
            dueDate: asg.dueDate,
            title: asg.title,
            questions: formData.map(({ question }) => ({ question })), // Extracting only the question field
        };

        console.log("Data to send", dataToSend);

        // Make your API call here to send dataToSend to the server
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post(`/api/getOneAsg`, { id });
                const assigments = res.data.assigments;

                console.log(assigments)
                setAsg(assigments)
                setLoading(false)
            } catch (error) {
                console.log(error)
            }

        }
        fetchData();
    }, [])
    if (loading) {
        return <div>Loading...</div>
    }
    console.log(asg.questions.length)

    return (
        <div className="container mx-auto">

            <h3 className="text-xl font-bold mb-2">Title: {asg.title}</h3>
            <h3 className="text-xl font-bold mb-2">Class Name: {asg.className}</h3>
            <h3 className="text-xl font-bold mb-2">Due Date: {asg.dueDate}</h3>

            {asg.questions.length > 0 && (
                <>

                    <form onSubmit={handleSubmit} className="space-y-4 px-4 mt-4">
                        {asg.questions.map((question, index) => (
                            <div key={question.id}>
                                <label htmlFor={`answer-${index}`} className="text-xl font-bold">Q{index + 1}. {question.question}</label>
                                <textarea
                                    id={`answer-${index}`}
                                    name={`answer-${index}`}
                                    placeholder="Enter answer"
                                    // value={question.answer}
                                    // onChange={e => handleAnswerChange(index, e)} // Add the corresponding function for handling answer changes
                                    className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                                ></textarea>
                            </div>
                        ))}
                    </form>
                </>
            )}
        </div>
    );

}

export default viewAsg;