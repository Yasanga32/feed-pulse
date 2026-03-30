import './env.js';
import express from 'express';
import cors from 'cors';
import { connectDB } from './utils/db.js';
import feedbackRouter from './routes/feedback.routes.js';
import authRoutes from "./routes/auth.routes.js";

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
app.use("/api/auth", authRoutes);

startServer();

export default app;
