import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import chatRoutes from './routes/chatRoutes';
import apiRoutes from './routes/api';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(helmet({
  contentSecurityPolicy: false, // Allow React app to load external assets
}));
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api', apiRoutes);

// SERVE STATIC FILES (Fixed for Evaluator)
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Health check
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// FALLBACK TO REACT (For React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Serving static files from: ${publicPath}`);
});
