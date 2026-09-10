import mongoose, { Schema, type Document } from 'mongoose';

export interface IWorkout extends Document {
  name: string;
  category: 'Strength' | 'Cardio' | 'Mobility' | 'Recovery';
  durationMinutes: number;
  difficulty: 'Easy' | 'Moderate' | 'Hard';
  equipment: string[];
  targetMuscleGroups: string[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const workoutSchema = new Schema<IWorkout>(
  {
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
  },
  { timestamps: true },
);

export const Workout =
  mongoose.models.Workout || mongoose.model<IWorkout>('Workout', workoutSchema);
