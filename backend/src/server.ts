import './env.js';
import express from 'express';
import cors from 'cors';
import { connectDB } from './utils/db.js';
import feedbackRouter from './routes/feedback.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running');
});

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

//routes
app.use('/api/feedback', feedbackRouter);

startServer();

export default app;
