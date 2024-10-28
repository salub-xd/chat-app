import { PrismaClient } from '@prisma/client';
import { Server, Socket } from 'socket.io';

const prisma = new PrismaClient();

// Socket.io server configuration
export const socket = (io: Server) => {
  
  io.on('connection', (socket: Socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join', ({ userId, receiverId }) => {
      if (!userId || !receiverId) {
        console.error('Invalid userId or receiverId in join event');
        return;
      }
      const roomName = [userId, receiverId].sort().join('-');
      socket.join(roomName);
      console.log(`User ${userId} joined room: ${roomName}`);
    });

    socket.on('typing', ({ senderId, receiverId }) => {
      if (!senderId || !receiverId) {
        console.error('Invalid senderId or receiverId in typing event');
        return;
      }
      const roomName = [senderId, receiverId].sort().join('-');
      socket.to(roomName).emit('user_typing', { senderId });
    });

    socket.on('stop_typing', ({ senderId, receiverId }) => {
      if (!senderId || !receiverId) {
        console.error('Invalid senderId or receiverId in stop_typing event');
        return;
      }
      const roomName = [senderId, receiverId].sort().join('-');
      socket.to(roomName).emit('stop_typing', { senderId });
    });

    socket.on('mark_as_read', async ({ senderId, receiverId }) => {

      console.log('Received mark_as_read event:', { senderId, receiverId });

      if (!senderId || !receiverId) {
        console.error('Invalid senderId or receiverId in mark_as_read event');
        return;
      }
      const roomName = [senderId, receiverId].sort().join('-');

      try {
        // Update message status in the database (optional, if needed)
        const updateResult = await prisma.message.updateMany({
          where: {
            senderId: receiverId,  // This should be the sender of the messages
            receiverId: senderId,  // This is the user who is reading the messages
            read: false,
          },
          data: {
            read: true,
          },
        });

        // Emit the mark_as_read event to the receiver's room
        socket.to(roomName).emit('mark_as_read', { senderId });
        console.log(`Marked messages as read in room: ${roomName}, affected: ${updateResult.count}`);
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    });

    socket.on('send_message', async (messageData) => {
      const { senderId, receiverId, message } = messageData;

      if (!senderId || !receiverId || !message) {
        console.error('Invalid message data in send_message event');
        return;
      }

      try {
        // Save the message in the database
        const savedMessage = await prisma.message.create({
          data: {
            senderId,
            receiverId,
            message,
          },
          include: {
            sender: true,
            receiver: true,
          },
        });

        // Send the message to both the sender's and receiver's rooms
        const roomName = [senderId, receiverId].sort().join('-');
        io.to(roomName).emit('receive_message', savedMessage);
        console.log(`Message sent in room: ${roomName}`);
      } catch (error) {
        console.error('Error saving or sending message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
