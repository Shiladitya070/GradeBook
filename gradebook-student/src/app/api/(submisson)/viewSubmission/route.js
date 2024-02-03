import { connectDB } from "@/dbConfig/dbConfig";
import submisions from "@/model/SubmissionSchema";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

connectDB()
export async function GET() {
    try {
        const user = await currentUser();
        const submissions = await submisions.find({ studentId: user.id })
        console.log(submissions)
        if (!submissions) {
            return NextResponse.json({ message: "No submission found", sucess: false }, { status: 404 })
        }
        return NextResponse.json({ submissions })
    } catch (error) {
        // If an error occurs, respond with an error message
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}