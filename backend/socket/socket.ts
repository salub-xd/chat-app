import { PrismaClient } from '@prisma/client';
import { Server, Socket } from 'socket.io';

const prisma = new PrismaClient();

// Socket.io server configuration
export const socket = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join', ({ userId, receiverId }) => {
      const roomName = [userId, receiverId].sort().join('-');
      socket.join(roomName);
    });

    socket.on('send_message', async (messageData) => {
      const { senderId, receiverId, message } = messageData;

      // Save the message in the database
      const savedMessage = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          message
        },
        include: {
          sender: true,
          receiver: true
        }
      });

      // Send the message to both the sender's and receiver's rooms
      const roomName = [senderId, receiverId].sort().join('-');
      io.to(roomName).emit('receive_message', savedMessage);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
