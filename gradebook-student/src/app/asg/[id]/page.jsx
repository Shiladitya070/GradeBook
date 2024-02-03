'use client'
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const viewAsg = () => {
    const { id } = useParams();
    const [asg, setAsg] = useState();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState([]);

    const handleInputChange = (id, event) => {
        const { value } = event.target;
        const updatedFormData = formData.map(item => {
            if (item.questionId === id) {
                return { ...item, answer: value };
            }
            return item;
        });

        const existingQuestionIndex = formData.findIndex(item => item.questionId === id);
        if (existingQuestionIndex === -1) {
            // If the questionId doesn't exist in the formData, add it
            setFormData([...formData, { questionId: id, answer: value }]);
        } else {
            // If the questionId already exists, update its answer
            setFormData(updatedFormData);
        }

    };
    console.log(formData)
    const handleSubmit = async event => {
        event.preventDefault();
        const dataSend = { assigmentsId: id, questions: formData }
        console.log("Form Data", dataSend);
        axios.post(`/api/submission`, dataSend)
            .then(res => { console.log(res.data); })
            .catch(err => console.log(err));

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
                                    // value={formData.answer}
                                    onChange={(e) => handleInputChange(question.id, e)} // Add the corresponding function for handling answer changes
                                    className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                                ></textarea>
                            </div>
                        ))}
                        <button
                            type="submit"
                            className="w-full px-4 py-2 mt-2 text-lg text-white bg-indigo-500 rounded-md hover:bg-indigo-400">
                            submit
                        </button>
                    </form>
                </>
            )}
        </div>
    );

}

export default viewAsg;