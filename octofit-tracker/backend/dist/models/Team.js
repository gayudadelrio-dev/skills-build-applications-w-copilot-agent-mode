import mongoose, { Schema } from 'mongoose';
const teamSchema = new Schema({
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    captainId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    goals: { type: [String], default: [] },
}, { timestamps: true });
export const Team = mongoose.models.Team || mongoose.model('Team', teamSchema);
