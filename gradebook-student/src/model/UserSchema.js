import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: [true, "Please provide a userId"],
            unique: true,
        },
        role: {
            type: String,
            required: [true, "Please provide a role"],
        },
    },
    { versionKey: false }
);

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;