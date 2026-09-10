import mongoose, { Schema } from 'mongoose';
const activitySchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
        type: String,
        enum: ['Run', 'Workout', 'Cycle', 'Walk', 'Swim'],
        required: true,
    },
    durationMinutes: { type: Number, required: true, min: 1 },
    distanceKm: { type: Number, default: 0 },
    caloriesBurned: { type: Number, default: 0 },
    notes: { type: String, default: '' },
}, { timestamps: true });
export const Activity = mongoose.models.Activity || mongoose.model('Activity', activitySchema);
