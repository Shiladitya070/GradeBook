import mongoose from "mongoose";

const SubmissonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    studentId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    },
    assigmentsId: {
        type: String,
        required: true
    },
    questions: [{
        marks: {
            type: Number,
        },
        answer: {
            type: String,
            required: true
        }
    }]
},
    { versionKey: false }
);

const submisions = mongoose.models.submisions || mongoose.model("submisions", SubmissonSchema);

export default submisions;