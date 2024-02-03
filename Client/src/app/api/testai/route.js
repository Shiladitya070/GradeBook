import { NextResponse } from "next/server"
import { HfInference } from '@huggingface/inference'

console.log(process.env.AI_KEY)
const hf = new HfInference(process.env.HF_KEY)
export const GET = async () => {

    const ai_data = await hf.sentenceSimilarity({
        model: 'sentence-transformers/paraphrase-xlm-r-multilingual-v1',
        inputs: {
            source_sentence: `Thick film and thin film lubrication are two concepts used to describe the thickness or viscosity of the lubricating layer between two surfaces in relative motion, typically in mechanical systems.

            1. **Thick Film Lubrication**:
               - Thick film lubrication occurs when there is a relatively thick layer of lubricant separating the two surfaces in contact. This layer is typically thick enough to prevent direct metal-to-metal contact between the surfaces, even under heavy loads or high pressures.
               - Thick film lubrication is often achieved with viscous lubricants such as oils or greases. These lubricants have high viscosity and can form a substantial layer between the surfaces.
               - The thick film of lubricant helps to reduce friction, dissipate heat, and prevent wear between the moving parts.
            
            2. **Thin Film Lubrication**:
               - Thin film lubrication, on the other hand, involves a much thinner layer of lubricant between the surfaces. The lubricant layer is only a few molecules thick.
               - This type of lubrication is typical in applications where extremely low friction is required, such as in high-speed machinery or precision instruments.
               - Thin film lubrication is often achieved with specialized lubricants such as synthetic oils or dry lubricants like molybdenum disulfide (MoS2) coatings.
               - The thin film of lubricant reduces friction while allowing the surfaces to move smoothly against each other with minimal resistance.
            
            In summary, the main difference between thick film and thin film lubrication lies in the thickness of the lubricant layer between the moving surfaces. Thick film lubrication involves a relatively thick layer of lubricant, while thin film lubrication involves a much thinner layer. Both types of lubrication play important roles in reducing friction, preventing wear, and extending the lifespan of mechanical components.`,
            sentences: [

                `Certainly! Let's explore thick film and thin film lubrication from a slightly different perspective:

                1. **Thick Film Lubrication**:
                   - Thick film lubrication refers to a situation where the lubricant layer between the moving surfaces is relatively thick compared to the surface roughness of the contacting components.
                   - This type of lubrication is often encountered in applications where the surfaces experience high loads, slow speeds, or where the lubricant viscosity is relatively high.
                   - The thick lubricant film acts as a cushion, separating the moving parts and preventing direct metal-to-metal contact. It helps to reduce friction, wear, and noise in the system.
                   - Common examples of thick film lubricants include grease and oil-based lubricants, which can form substantial layers between the surfaces.
                
                2. **Thin Film Lubrication**:
                   - Thin film lubrication occurs when the lubricant layer between the surfaces is very thin compared to the surface roughness of the contacting components.
                   - This type of lubrication is often encountered in applications where the surfaces experience light loads, high speeds, or where the lubricant viscosity is relatively low.
                   - In thin film lubrication, the lubricant forms a thin, molecular-level layer on the surfaces, providing sufficient separation to reduce friction and wear.
                   - Thin film lubricants are typically used in precision machinery, high-speed applications, and situations where minimizing friction and energy losses are critical.
                   - Examples of thin film lubricants include synthetic oils, dry lubricants like graphite or MoS2 coatings, and boundary lubricants.
                
                In summary, thick film lubrication involves a thicker layer of lubricant suitable for heavier loads and slower speeds, while thin film lubrication involves a thinner layer of lubricant ideal for lighter loads and higher speeds. Both types of lubrication play vital roles in minimizing friction and extending the life of mechanical components, but they are tailored to different operating conditions and requirements.`,

                `Thick Film Lubrication:

                In thick film lubrication, a relatively thick layer of lubricant separates the moving surfaces.
                It's common in applications with heavy loads or low speeds.
                Thick lubricant layers cushion and prevent direct metal-to-metal contact, reducing friction and wear.
                Examples include grease and high-viscosity oils.
                Thin Film Lubrication:
                
                Thin film lubrication involves a much thinner layer of lubricant between moving surfaces.
                It's used in applications with light loads or high speeds.
                Thin lubricant layers minimize friction while allowing smooth movement.
                Examples include synthetic oils, dry lubricants, and boundary lubricants.
                In summary, thick film lubrication has a thicker layer suited for heavy loads and low speeds, while thin film lubrication offers a thinner layer ideal for light loads and high speeds. Both types reduce friction and wear but cater to different mechanical demands.`,

                `Thin Film Lubrication:

                Thin film lubrication involves a much thinner layer of lubricant between moving surfaces.
                It's used in applications with light loads or high speeds.
                Thin lubricant layers minimize friction while allowing smooth movement.
                Examples include synthetic oils, dry lubricants, and boundary lubricants.`
            ]
        }
    })
    return NextResponse.json({ data: "got it", ai_data })
} 