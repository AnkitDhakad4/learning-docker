import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import noteRoutes from './routes/noteRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors(
  {
    origin:process.env.CLIENT_URL,
    credentials:true
  }
));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/',(req,res)=>{
  res.status(200).json({
    status: 'ok',
    service: 'MERN Notes & Snippet Manager API',
    timestamp: new Date().toISOString(),
  });
})

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'MERN Notes & Snippet Manager API',
    timestamp: new Date().toISOString(),
  });
});

// Primary API routes
app.use('/api/notes', noteRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT,'0.0.0.0',() => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on http://localhost:${PORT}`);
});
 
