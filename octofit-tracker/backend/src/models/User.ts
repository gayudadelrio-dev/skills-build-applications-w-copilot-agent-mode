import mongoose, { Schema, type Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  fullName: string;
  fitnessLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  teamId?: mongoose.Types.ObjectId | null;
  goals: string[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
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
  },
  { timestamps: true },
);

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
