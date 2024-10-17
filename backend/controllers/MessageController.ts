import { Request, Response } from 'express';
import prisma from "../prisma";

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