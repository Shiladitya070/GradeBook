import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema({
    publieshed: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    className: {
        type: String,
        required: true
    },
    questions: [{
        question: {
            type: String,
            required: true
        },
        answer: {
            type: String,
            required: true
        }
    }]
},
    { versionKey: false }
);

const assignment = mongoose.models.assignments || mongoose.model("assignments", AssignmentSchema);

export default assignment;