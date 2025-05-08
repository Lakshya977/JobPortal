import './config/instrument.js';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/db.js';
import * as Sentry from '@sentry/node';
import { clerkWebhook } from './controller/webhooks.js';
import companyroutes from './routes/companyroutes.js';
import connectCloudinary from './config/cloudinary.js';
import jobRoutes from './routes/jobRoutes.js';
const startServer = async () => {
  await connectDB();
  await connectCloudinary();
  const app = express();
  // Middleware
  app.use(cors());
  app.use(express.json());

  // Routes
  app.get('/', (req, res) => res.send("API working"));

  app.get("/debug-sentry", (req, res) => {
    throw new Error("My first Sentry error!");
  });

  app.post('/clerk-webhook', clerkWebhook);
  app.use('/api/company',companyroutes) 


  app.use('/api/jobs',jobRoutes)
  

  const PORT = process.env.PORT || 5000;
  Sentry.setupExpressErrorHandler(app);
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
