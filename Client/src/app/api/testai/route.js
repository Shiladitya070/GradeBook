import { NextResponse } from "next/server"

console.log(process.env.AI_KEY)
export const GET = () => {
    return NextResponse.json({ data: "got it" })
} 