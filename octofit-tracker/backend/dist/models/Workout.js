import mongoose, { Schema } from 'mongoose';
const workoutSchema = new Schema({
    name: { type: String, required: true, trim: true },
    category: {
        type: String,
        enum: ['Strength', 'Cardio', 'Mobility', 'Recovery'],
        required: true,
    },
    durationMinutes: { type: Number, required: true, min: 10 },
    difficulty: {
        type: String,
        enum: ['Easy', 'Moderate', 'Hard'],
        required: true,
    },
    equipment: { type: [String], default: [] },
    targetMuscleGroups: { type: [String], default: [] },
    description: { type: String, default: '' },
}, { timestamps: true });
export const Workout = mongoose.models.Workout || mongoose.model('Workout', workoutSchema);
