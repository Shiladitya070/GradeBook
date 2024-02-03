import { connectDB } from "@/dbConfig/dbConfig";
import assignment from "@/model/AssignmentSchema";
import { NextResponse } from "next/server";

connectDB()
export async function POST(req) {
    try {
        const body = await req.json();
        const { id } = body;
        const assigments = await assignment.findById(id) // Parse the JSON data from the request body
        const { _id, className, dueDate, title, questions } = assigments
        const onlyQuestion = questions.map(({ question, answer, _id }) => ({ question, id: _id }));
        console.log(onlyQuestion)
        if (!assigments) {
            return NextResponse.json({ message: "No assigment found", sucess: false }, { status: 404 })
        }
        return NextResponse.json({
            message: "Created assigment successfully", sucess: true, assigments: {
                id: _id,
                className,
                dueDate,
                questions: onlyQuestion,
                title,
            }
        })
    } catch (error) {
        // If an error occurs, respond with an error message
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}