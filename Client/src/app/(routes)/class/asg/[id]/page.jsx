'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function AssignmentStudent() {
    const { id } = useParams()
    const [question, setQuestion] = useState([{
        question: "What is the capital of Nigeria?",
        questionId: "1",
    }, {
        question: "What is the capital of Nigeria?",
        questionId: "2",
    }, {
        question: "What is the capital of Nigeria?",
        questionId: "3",
    }, {
        question: "What is the capital of Nigeria?",
        questionId: "4"
    }]);
    const [formData, setFormData] = useState(
        question.map(question => ({ questionId: question.questionId, answer: '' }))
    );

    const handleInputChange = (index, event) => {
        const { value } = event.target;
        const updatedFormData = [...formData];
        updatedFormData[index].answer = value;
        setFormData(updatedFormData);
    };

    const handleSubmit = event => {
        event.preventDefault();
        console.log("Submitted Data", formData);
        // You can handle form submission logic here, such as sending the data to an API
    };

    useEffect(() => {
        // fetch 
    }, [])
    return (
        <div className="container mx-auto">
            <h2 className="text-2xl font-bold mb-4">Question Form</h2>
            <form onSubmit={handleSubmit} className="space-y-4 px-4">
                {formData.map((field, index) => (
                    <div key={field.questionId} className="flex flex-col space-x-2">
                        <label className="w-1/3">{question[index].question}</label>
                        <textarea
                            value={field.answer}
                            onChange={e => handleInputChange(index, e)}
                            className="w-2/3 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                ))}
                <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600"
                >
                    Submit
                </button>
            </form>
        </div>
    )
}

export default AssignmentStudent




