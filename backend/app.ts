import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server as SocketIOServer } from 'socket.io';
import cookieParser from 'cookie-parser';
import userRouter from './routes/userRoute';
import prisma from './prisma';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use('/userapi', userRouter);

const PORT = process.env.PORT;

const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.get('/', (req: any, res: any) => {
    res.send('<h1>Hello world</h1>');
});


io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Listening for "send_message" event
    socket.on('send_message', async (data) => {
        const { senderId, receiverId, message } = data;

        try {
            // Save the message to the database using Prisma
            const chatMessage = await prisma.message.create({
                data: {
                    message,
                    senderId,
                    receiverId,
                }
            });

            // Emit the message to the receiver's socket
            io.to(receiverId).emit('receive_message', chatMessage);

            // Acknowledge the sender
            socket.emit('message_sent', chatMessage);

        } catch (error) {
            console.error("Error saving message:", error);
            socket.emit('error', 'Error sending message');
        }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(PORT || 3000, () => {
    console.log('listening on :3000');
});