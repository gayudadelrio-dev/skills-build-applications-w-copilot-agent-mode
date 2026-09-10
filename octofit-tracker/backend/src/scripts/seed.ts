import mongoose from 'mongoose';
import { Activity } from '../models/Activity.js';
import { LeaderboardEntry } from '../models/Leaderboard.js';
import { Team } from '../models/Team.js';
import { User } from '../models/User.js';
import { Workout } from '../models/Workout.js';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);
    console.log('Connected to octofit_db');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      LeaderboardEntry.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.insertMany([
      {
        username: 'mariafit',
        email: 'maria@example.com',
        passwordHash: 'hashed_password_1',
        fullName: 'Maria Lopez',
        fitnessLevel: 'Advanced',
        goals: ['Run 5K', 'Improve endurance'],
      },
      {
        username: 'davidstreak',
        email: 'david@example.com',
        passwordHash: 'hashed_password_2',
        fullName: 'David Chen',
        fitnessLevel: 'Intermediate',
        goals: ['Strength training', 'Track calories'],
      },
      {
        username: 'sophiaflow',
        email: 'sophia@example.com',
        passwordHash: 'hashed_password_3',
        fullName: 'Sophia Nguyen',
        fitnessLevel: 'Beginner',
        goals: ['Mobility', 'Daily walks'],
      },
    ]);

    const team = await Team.create({
      name: 'Iron Pulse',
      description: 'Community team for strength and endurance goals.',
      captainId: users[0]._id,
      members: users.map((user) => user._id),
      goals: ['Weekly challenge', 'Increase daily activity'],
    });

    await User.updateMany(
      { _id: { $in: users.map((user) => user._id) } },
      { $set: { teamId: team._id } },
    );

    const activities = await Activity.insertMany([
      {
        userId: users[0]._id,
        type: 'Run',
        durationMinutes: 42,
        distanceKm: 7.5,
        caloriesBurned: 510,
        notes: 'Morning interval run',
      },
      {
        userId: users[1]._id,
        type: 'Workout',
        durationMinutes: 50,
        caloriesBurned: 430,
        notes: 'Upper body strength focus',
      },
      {
        userId: users[2]._id,
        type: 'Walk',
        durationMinutes: 30,
        distanceKm: 2.8,
        caloriesBurned: 180,
        notes: 'Recovery walk',
      },
    ]);

    await LeaderboardEntry.insertMany([
      {
        userId: users[0]._id,
        username: users[0].username,
        score: 980,
        rank: 1,
        streakDays: 12,
      },
      {
        userId: users[1]._id,
        username: users[1].username,
        score: 860,
        rank: 2,
        streakDays: 9,
      },
      {
        userId: users[2]._id,
        username: users[2].username,
        score: 730,
        rank: 3,
        streakDays: 6,
      },
    ]);

    await Workout.insertMany([
      {
        name: 'HIIT Cardio Blast',
        category: 'Cardio',
        durationMinutes: 25,
        difficulty: 'Hard',
        equipment: ['Jump rope'],
        targetMuscleGroups: ['Legs', 'Core'],
        description: 'Short, high-intensity workout for explosive fitness.',
      },
      {
        name: 'Full Body Strength',
        category: 'Strength',
        durationMinutes: 40,
        difficulty: 'Moderate',
        equipment: ['Dumbbells'],
        targetMuscleGroups: ['Chest', 'Back', 'Legs', 'Shoulders'],
        description: 'Compound lifts to build total-body strength.',
      },
      {
        name: 'Mobility Reset',
        category: 'Mobility',
        durationMinutes: 20,
        difficulty: 'Easy',
        equipment: ['Yoga mat'],
        targetMuscleGroups: ['Hamstrings', 'Hips', 'Back'],
        description: 'Gentle mobility flow to improve range of motion.',
      },
    ]);

    console.log('Seeded users:', users.length);
    console.log('Seeded activities:', activities.length);
    console.log('Seeded leaderboard entries:', 3);
    console.log('Seeded workouts:', 3);
    console.log('Seeded team:', team.name);

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
