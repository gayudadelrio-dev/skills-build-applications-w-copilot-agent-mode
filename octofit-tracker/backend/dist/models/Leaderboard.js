import mongoose, { Schema } from 'mongoose';
const leaderboardSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    username: { type: String, required: true, trim: true },
    score: { type: Number, required: true, default: 0 },
    rank: { type: Number, required: true, min: 1 },
    streakDays: { type: Number, default: 0 },
}, { timestamps: true });
export const LeaderboardEntry = mongoose.models.LeaderboardEntry ||
    mongoose.model('LeaderboardEntry', leaderboardSchema);
