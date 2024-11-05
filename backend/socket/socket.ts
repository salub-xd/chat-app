import { PrismaClient } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { redisClient } from '../redis';

const prisma = new PrismaClient();

// Socket.io server configuration
export const socket = (io: Server) => {

  io.on('connection', (socket: Socket) => {
    console.log('A user connected:', socket.id);

    // const savedMessage = 'aa'

    // io.emit('receive_message', savedMessage);

    const userId = socket.handshake.query.userId;

    // Add the user's socket ID to their Redis set
    console.log('Handshake userId : ', userId);

    redisClient.sadd(`ONLINE_USER:${userId}`, socket.id);
    socket.emit('user_status', { userId, status: 'online' });


    // Listen for the event where a user joins a conversation room
    socket.on('join_conversation', ({ conversationId, userId }) => {
      if (!conversationId || !userId) {
        console.error('Invalid conversationId or userId in join event');
        return;
      }

      socket.join(conversationId);
      const savedMessage = 'aa'

      io.emit('receive_message', savedMessage);
      console.log(`User ${userId} joined room ${conversationId}`);
    });

    socket.on('user_typing', ({ conversationId, userId }) => {
      if (!conversationId || !userId) {
        console.error('Invalid conversationId or userId in typing event');
        return;
      }
      console.log(conversationId, "to user_tying", userId);

      socket.to(conversationId).emit('user_typing', { userId });
    });

    socket.on('stop_typing', ({ conversationId, userId }) => {
      if (!conversationId || !userId) {
        console.error('Invalid conversationId or userId in stop_typing event');
        return;
      }
      console.log(conversationId, "to stop_typing", userId);
      socket.to(conversationId).emit('stop_typing', { userId });
    });

    // socket.on('mark_as_read', async ({ conversationId, userId }) => {

    //   console.log('Received mark_as_read event:', { conversationId, userId });

    //   if (!conversationId || !userId) {
    //     console.error('Invalid senderId or receiverId in mark_as_read event');
    //     return;
    //   }

    //   try {
    //     // Update message status in the database (optional, if needed)
    //     const updateResult = await prisma.message.updateMany({
    //       where: {
    //         senderId: receiverId,  // This should be the sender of the messages
    //         isRead: false,
    //       },
    //       data: {
    //         isRead: true,
    //       },
    //     });

    //     // Emit the mark_as_read event to the receiver's room
    //     socket.to(roomName).emit('mark_as_read', { senderId });
    //     console.log(`Marked messages as read in room: ${roomName}, affected: ${updateResult.count}`);
    //   } catch (error) {
    //     console.error('Error marking messages as read:', error);
    //   }
    // });

    socket.on('remove_reaction', async (messageData) => {
      const { reactionId, messageId } = messageData;
      console.log(messageData);

      if (!messageId || !reactionId) {
        console.log('Invalid reaction data in remove_reaction event');
        return;
      }

      try {

        const reactionMessage = await prisma.reaction.delete({
          where: {
            id: reactionId,
            messageId: messageId,
          }
        });

        console.log("reactionMessage deleting : ", reactionMessage);


      } catch (error) {
        console.error('Error removing reaction:', error);
      }
    });

    socket.on('send_reaction', async (messageData) => {
      const { userId, messageId, emoji } = messageData;
      console.log(messageData);

      if (!messageId || !userId || !emoji) {
        console.log('Invalid reaction data in send_reaction event');
        return;
      }

      try {

        const reactionMessage = await prisma.reaction.create({
          data: {
            messageId: messageId,
            userId: userId,
            emoji: emoji,
          }
        });

        console.log("reactionMessage : ", reactionMessage);


      } catch (error) {
        console.error('Error saving or sending reaction:', error);
      }

    });

    socket.on('send_message', async (messageData) => {
      const { conversationId, userId, message } = messageData;

      console.log(messageData);
      if (!conversationId || !userId || !message) {
        console.log('Invalid message data in send_message event');
        return;
      }

      try {
        // Save the message in the database
        const savedMessage = await prisma.message.create({
          data: {
            senderId: userId,
            message,
            conversationId: conversationId
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        });

        // Update the conversation's lastMessageId and lastMessageAt
        await prisma.conversation.update({
          where: { id: conversationId },
          data: {
            lastMessageId: savedMessage.id,
            lastMessageAt: savedMessage.createdAt,
          },
        });

        // socket.in(conversationId).emit('receive_message', savedMessage);
        // Send the message to both the sender's and receiver's rooms
        io.in(conversationId).emit('receive_message', savedMessage);
        console.log(`Message sent in room: ${conversationId}`);
      } catch (error) {
        console.error('Error saving or sending message:', error);
      }
    });

    socket.on('disconnect', async () => {
      console.log('User disconnected:', socket.id);
      // delete user from redis
      await redisClient.srem(`ONLINE_USER:${userId}`, socket.id);
      // select user from redis
      const remainingSockets = await redisClient.scard(`ONLINE_USER:${userId}`);

      // If no more sockets, mark the user as offline

      if (remainingSockets === 0) {
        await redisClient.del(`ONLINE_USER:${userId}`);
        io.emit('user_status', { userId, status: "offline" });
      }

    });
  });
};
