import { NextResponse } from "next/server"
import { HfInference } from '@huggingface/inference'

console.log(process.env.AI_KEY)
const hf = new HfInference(process.env.HF_KEY)
export const GET = async () => {

    const ai_data = await hf.sentenceSimilarity({
        model: 'jpwahle/longformer-base-plagiarism-detection',
        inputs: {
            source_sentence: "You ",
        }
    })
    return NextResponse.json({ data: "got it", ai_data })
} 