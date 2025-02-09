import {Server} from 'socket.io';
import express from 'express';
import http from 'http';

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
   cors: {
      origin: ['https://shiny-happiness-5g4g7rjg4jjj2v77g-8000.app.github.dev'],
      methods: ['GET', 'POST'],
   },
});

const userSocketMap = {}; // this stors socket id corresponding to userId; userId --> socketId

export const getReciverSocketId = (receiverId) => userSocketMap[receiverId]
 
io.on('connection', (socket) => {
   const userId = socket.handshake.query.userId;
   if (userId) {
      userSocketMap[userId] = socket.id;
      console.log(`user connected, userId = ${userId} & socketId = ${socket.id}`);
   }
   
   io.emit('getOnlineUsers', Object.keys(userSocketMap));
   
   socket.on('disconnect', () => {
      console.log(`user disconnected, userId = ${userId} & socketId = ${socket.id}`);
      if (userId) {
         delete userSocketMap[userId];
      }
      io.emit('getOnlineUsers', Object.keys(userSocketMap));
   });
});

export { io, server, app };