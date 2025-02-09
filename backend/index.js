import express, {urlencoded} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from './utils/db.js';
import userRoute from './routes/userRoute.js';
import postRoute from './routes/postRoute.js';
import messageRoute from './routes/messageRoute.js';
import { app, server } from './socket/socket.js';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config({});

// const app = express();

const PORT = process.env.PORT || 8000;

const __dirname = path.resolve();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}));
const corsOptions = {
   origin: 'https://instadebo.onrender.com',
   credentials:true
};
app.use(cors(corsOptions));

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

app.use(express.static(path.join(__dirname, '/frontend/dist')));
app.get('*', (req, res) => {
   res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
});

server.listen(PORT, () => {
   connectDB();
   console.log(`Server listen at http://localhost:${PORT}`);
});
