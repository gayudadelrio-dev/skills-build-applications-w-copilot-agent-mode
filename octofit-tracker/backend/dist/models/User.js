import mongoose, { Schema } from 'mongoose';
const userSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, required: true, trim: true },
    fitnessLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner',
    },
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', default: null },
    goals: { type: [String], default: [] },
}, { timestamps: true });
export const User = mongoose.models.User || mongoose.model('User', userSchema);
