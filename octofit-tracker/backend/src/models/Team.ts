import mongoose, { Schema, type Document } from 'mongoose';

export interface ITeam extends Document {
  name: string;
  description: string;
  captainId: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  goals: string[];
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema<ITeam>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    captainId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    goals: { type: [String], default: [] },
  },
  { timestamps: true },
);

export const Team = mongoose.models.Team || mongoose.model<ITeam>('Team', teamSchema);
