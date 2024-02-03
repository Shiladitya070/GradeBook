import { connectDB } from "@/dbConfig/dbConfig";
import assignment from "@/model/AssignmentSchema";
import { NextResponse } from "next/server";

connectDB()
export async function GET() {
    try {
        let assigments = await assignment.find({}) // Parse the JSON data from the request body
        console.log(assigments)
        if (!assigments) {
            return NextResponse.json({ message: "No assigment found", sucess: false }, { status: 404 })
        }
        assigments = assigments.map(({ _id, dueDate, title }) => ({ id: _id, dueDate, title }))
        console.log(assigments)

        return NextResponse.json({ assigments })
    } catch (error) {
        // If an error occurs, respond with an error message
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}