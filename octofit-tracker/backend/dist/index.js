import express from 'express';
import mongoose from 'mongoose';
const app = express();
const PORT = Number(process.env.PORT || 8000);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';
app.use(express.json());
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'octofit-backend' });
});
async function startServer() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB at', MONGODB_URI);
        app.listen(PORT, () => {
            console.log(`OctoFit backend listening on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start OctoFit backend:', error);
        process.exit(1);
    }
}
startServer();
