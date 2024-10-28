import { Request, Response } from 'express';
import prisma from "../prisma";


export const userContact = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // The current user ID

  try {
    console.log(id);

    // Fetch all messages where the current user is either the sender or receiver
    const userMessages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: id },
          { receiverId: id }
        ]
      },
      orderBy: {
        createdAt: 'desc' // Order by created time to get the last message
      },
      select: {
        senderId: true,
        receiverId: true,
        message: true,
        createdAt: true,
        read: true // Fetching read status
      }
    });

    // Extract distinct user IDs involved in conversations
    const contactIds = Array.from(new Set(userMessages.flatMap((message: any) => [
      message.senderId === id ? message.receiverId : message.senderId
    ])));

    // Prepare contacts data with last message details and unseen messages count
    const contacts = await Promise.all(contactIds.map(async (contactId) => {
      // Get the last message for the contact
      const lastMessageData = userMessages.find((message: any) => 
        (message.senderId === id && message.receiverId === contactId) || 
        (message.senderId === contactId && message.receiverId === id)
      );

      // Count unread messages between the current user and the contact
      const unseenMessagesCount = await prisma.message.count({
        where: {
          senderId: contactId, // The other user sent these messages
          receiverId: id,      // The current user received them
          read: false          // Messages that are unread
        }
      });

      // Fetch the user's details
      const contactDetails = await prisma.user.findUnique({
        where: { id: contactId },
        select: {
          id: true,
          name: true,
          username: true,
          image: true
        }
      });

      return {
        id: contactId,
        name: contactDetails?.name || null,
        username: contactDetails?.username || null,
        image: contactDetails?.image || null,
        lastMessage: lastMessageData?.message || null,
        lastMessageTime: lastMessageData?.createdAt || null,
        isRead: lastMessageData ? lastMessageData.read : null,
        unseenMessagesCount // Count of unread messages
      };
    }));

    res.json(contacts); // Return the contact details including unseen messages count

  } catch (error) {
    console.error("Error fetching user contacts: ", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



export const messages = async (req: Request, res: Response): Promise<void> => {
  const { userId, receiverId } = req.query;
  try {
    console.log(userId, receiverId);

    // Check if userId and receiverId are provided
    if (!userId || !receiverId) {
      res.status(400).json({ error: 'Both userId and receiverId are required' });
      return;
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId },
          { senderId: receiverId, receiverId: userId }
        ]
      },
      include: {
        sender: {
          select: { id: true, name: true, image: true }
        },
        receiver: {
          select: { id: true, name: true, image: true }
        }
      },
      orderBy: {
        createdAt: 'asc'  // Sort messages by creation time
      }
    });


    res.status(200).json(messages);

  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}


export const markMessagesAsSeen = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // The current user ID
  const { contactId } = req.body; // The ID of the contact whose messages should be marked as read

  try {
    // Update all messages from the contact to the user as read
    await prisma.message.updateMany({
      where: {
        senderId: contactId, // The other user sent these messages
        receiverId: id,      // The current user received them
        read: false          // Only mark unread messages
      },
      data: {
        read: true           // Mark them as read
      }
    });

    res.json({ message: "Messages marked as seen." });
  } catch (error) {
    console.error("Error marking messages as seen: ", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};