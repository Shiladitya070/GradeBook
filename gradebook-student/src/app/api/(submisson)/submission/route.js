import { connectDB } from "@/dbConfig/dbConfig";
import assignment from "@/model/AssignmentSchema";
import submisions from "@/model/SubmissionSchema";
import { currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

connectDB()
export async function POST(req) {
    try {
        const body = await req.json();
        const user = await currentUser();
        console.log("🫂🫂", body);

        const { assigmentsId, questions } = body;
        const asg = await assignment.findById(assigmentsId)
        const convertedQuestions = questions.map(question => {
            return {
                _id: question.questionId,
                answer: question.answer
            };
        })
        try {
            const newSubmission = new submisions({
                name: asg.title,
                studentId: user.id,
                createdAt: new Date(),
                assigmentsId,
                questions: convertedQuestions
            });

            const savedSubmission = await newSubmission.save();
            console.log("🫡🫡", savedSubmission);

            return NextResponse.json({ message: "Submitted assignment successfully", success: true, savedSubmission });
        } catch (error) {
            console.error("Error occurred while submitting assignment:", error);
            return NextResponse.json({ message: "Error occurred while submitting assignment", success: false });
        }

    } catch (error) {
        // If an error occurs, respond with an error message
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}