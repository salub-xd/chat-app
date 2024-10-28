import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoute';
import messageRouter from './routes/messageRoute';
import prisma from './prisma';
import JWTService from './middleware/jwt';
import { socket } from './socket/socket';
import verify from './middleware/verify';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(cors({
    origin: 'http://localhost:3000', // Frontend origin
    credentials: true, // Allow credentials (cookies, HTTP authentication, etc.)
}));
app.use('/userapi', userRouter);
app.use('/api', messageRouter);

const PORT = process.env.PORT;

const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PATCH", "DELETE"]
    }
});

app.get('/', (req: any, res: any) => {
    res.send('<h1>Hello world</h1>');
});

// io.on('connection', (socket) => {
//     const token = socket.handshake.auth.token;
//     const jwtVerification = JWTService.decodeToken(token);
//     if (!jwtVerification) {
//         socket.emit('error', 'User Unauthorized');
//         socket.disconnect();
//         return;
//     }

//     const userId = jwtVerification.id;
//     console.log(`User ${userId} connected:`, socket.id);

//     // Debug the `join` event
//     socket.on('join', (data) => {
//         console.log('Join event data:', data); // Add this to log the received data
//         const { userId, receiverId } = data;  // Make sure data contains these fields
//         const roomId = [userId, receiverId].sort().join('_');
//         socket.join(roomId);
//         console.log(`User ${userId} has joined room: ${roomId}`);
//     });

//     socket.on('send_message', async (data) => {
//         const { senderId, receiverId, message } = data;

//         try {
//             const chatMessage = await prisma.message.create({
//                 data: {
//                     message,
//                     senderId,
//                     receiverId,
//                 }
//             });

//             const roomId = [senderId, receiverId].sort().join('_');
//             io.to(roomId).emit('receive_message', chatMessage);

//             socket.emit('message_sent', chatMessage);
//         } catch (error) {
//             console.error("Error saving message:", error);
//             socket.emit('error', 'Error sending message');
//         }
//     });

//     socket.on('disconnect', () => {
//         console.log('User disconnected:', socket.id);
//     });
// });

// io.use((socket, next) => {
//     const token = socket.handshake.auth.token;
//     // console.log("Token :" ,token);
    

//     const data = JWTService.decodeToken(token); // Decode or verify the token
//     if (!data) {
//          next(new Error("Authentication Error!"));
//     }

//     // console.log("data : ",data);
    

//     next();

// })

socket(io);

server.listen(PORT || 3000, () => {
    console.log(`listening on : ${PORT}`);
});