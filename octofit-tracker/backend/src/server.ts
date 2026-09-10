import express from 'express';
import { Activity } from './models/Activity.js';
import { LeaderboardEntry } from './models/Leaderboard.js';
import { Team } from './models/Team.js';
import { User } from './models/User.js';
import { Workout } from './models/Workout.js';
import { connectDatabase } from './config/database.js';

const app = express();
const PORT = Number(process.env.PORT || 8000);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
const codespaceName = process.env.CODESPACE_NAME;
const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'octofit-backend',
    baseUrl,
    mongodb: MONGODB_URI,
  });
});

app.get('/api/config', (_req, res) => {
  res.json({
    apiBaseUrl: baseUrl,
    frontendBaseUrl: codespaceName
      ? `https://${codespaceName}-5173.app.github.dev`
      : 'http://localhost:5173',
  });
});

app.get('/api/users', async (_req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
});

app.post('/api/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: 'User creation failed', error });
  }
});

app.get('/api/teams', async (_req, res) => {
  const teams = await Team.find().populate('captainId').populate('members');
  res.json(teams);
});

app.post('/api/teams', async (req, res) => {
  try {
    const team = await Team.create(req.body);
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ message: 'Team creation failed', error });
  }
});

app.get('/api/activities', async (_req, res) => {
  const activities = await Activity.find().populate('userId').sort({ createdAt: -1 });
  res.json(activities);
});

app.post('/api/activities', async (req, res) => {
  try {
    const activity = await Activity.create(req.body);
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ message: 'Activity creation failed', error });
  }
});

app.get('/api/leaderboard', async (_req, res) => {
  const leaderboard = await LeaderboardEntry.find().sort({ score: -1, rank: 1 });
  res.json(leaderboard);
});

app.post('/api/leaderboard', async (req, res) => {
  try {
    const entry = await LeaderboardEntry.create(req.body);
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ message: 'Leaderboard entry creation failed', error });
  }
});

app.get('/api/workouts', async (_req, res) => {
  const workouts = await Workout.find().sort({ createdAt: -1 });
  res.json(workouts);
});

app.post('/api/workouts', async (req, res) => {
  try {
    const workout = await Workout.create(req.body);
    res.status(201).json(workout);
  } catch (error) {
    res.status(400).json({ message: 'Workout creation failed', error });
  }
});

async function startServer() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`OctoFit backend listening on ${baseUrl}`);
    });
  } catch (error) {
    console.error('Failed to start OctoFit backend:', error);
    process.exit(1);
  }
}

startServer();
