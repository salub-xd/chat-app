import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../prisma/index';
import JWTService from '../middleware/jwt';
import { generateUsername } from '../services/user';
import axios from 'axios';
import { GoogleTokenResult } from '../types';

// Register User
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password, name, username } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: 'User already exists' });
      return;
    };

    // console.log(existingUser);
    // console.log("username : ", username);

    const usernameExists = await prisma.user.findUnique({
      where: { username },
    });
    // console.log(usernameExists);

    if (usernameExists) {
      res.status(400).json({ error: 'Username already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        username,
      },
    });

    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password!);
    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }

    // User logged in successfully

    const jwtToken = JWTService.generateTokenForUser(user);

    res.cookie('token', jwtToken, {
      // httpOnly: true, // Prevents access by JavaScript
      // secure: process.env.NODE_ENV === 'production', // Ensure cookie is only sent over HTTPS in production
      sameSite: 'strict', // Helps with CSRF protection
      maxAge: 60 * 60 * 1000 // Token expiry: 1 hour
    });

    res.status(200).json({
      message: 'Login successful', user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        bio: user.bio,
      }
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const editUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { name, username, bio, email, image, coverImage, password } = req.body;

  try {
    // Verify the JWT token from the request headers
    const token = req.cookies.token; 
    const decodedToken = JWTService.decodeToken(token); 
    const loggedInUserId = decodedToken?.id; 

    if (loggedInUserId !== id) {
      res.status(403).json({ error: 'You do not have permission to edit this user.' });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Validate the new data here (e.g., check if email is already taken)
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });
      if (emailExists) {
        res.status(400).json({ error: 'Email is already in use.' });
        return;
      }
    }

    if (username && username !== existingUser.username) {
      const usernameExists = await prisma.user.findUnique({
        where: { username },
      });
      if (usernameExists) {
        res.status(400).json({ error: 'Username is already in use.' });
        return;
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        username,
        bio,
        email,
        image,
        coverImage,
        password: password ? await bcrypt.hash(password, 10) : existingUser.password, // Retain old password if none provided
      },
    });

    res.status(200).json({ message: 'User updated successfully', updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};


export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const token = req.cookies.token; 
  const decodedToken = JWTService.decodeToken(token); 
  const userIdFromToken = decodedToken?.id; 

  if (!id) {
    res.status(400).json({ error: 'Invalid user ID' });
    return;
  }

  try {
    const userToDelete = await prisma.user.findUnique({
      where: { id },
    });

    if (!userToDelete) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (userIdFromToken !== userToDelete.id ) { 
      res.status(403).json({ error: 'Forbidden: You do not have permission to delete this user.' });
      return;
    }

    await prisma.user.delete({
      where: { id },
    });

    res.status(200).json({ message: "User deleted successfully!" });

  } catch (error) {
    console.error("Error deleting user:", error); 
    res.status(500).json({ error: 'Internal server error' });
  }

}

export const searchUserById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const searchUserByUsername = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const searchUserByName = async (req: Request, res: Response): Promise<void> => {
  const { name } = req.query; // Using query parameters

  try {
    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: name as string, // Case-insensitive search
          mode: 'insensitive',      // Prisma's mode to make the search case-insensitive
        },
      },
    });

    if (users.length === 0) {
      res.status(404).json({ error: 'No users found' });
      return;
    }

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        bio: true,
        image: true,
        coverImage: true,
      },
    });

    if (users.length === 0) {
      res.status(404).json({ message: 'No users found' });
      return;
    }

    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
};


export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body; // Ensure the token is sent in the request body

    const googleOauthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
    googleOauthURL.searchParams.set("id_token", token);

    const { data } = await axios.get<GoogleTokenResult>(
      googleOauthURL.toString(),
      {
        responseType: "json",
      }
    );

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      const username = await generateUsername(data.email);

      await prisma.user.create({
        data: {
          email: data.email,
          name: data.given_name,
          username: username,
          profileImage: data.picture,
          isOAuth: true,
        },
      });
    }

    const userInDb = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!userInDb) {
      res.status(404).json({ error: "User with email not found" });
      return;
    }

    const userToken = JWTService.generateTokenForUser(userInDb);

    res.cookie('token', userToken, {
      httpOnly: true, // Prevents access by JavaScript
      secure: process.env.NODE_ENV === 'production', // Ensure cookie is only sent over HTTPS in production
      sameSite: 'strict', // Helps with CSRF protection
      maxAge: 60 * 60 * 1000 // Token expiry: 1 hour
    });

    res.status(200).json({
      message: 'Login successful', user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        bio: user.bio,
      }
    });
    

  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};