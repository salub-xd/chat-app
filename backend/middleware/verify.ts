import { Request, Response, NextFunction } from 'express';
import JWTService from './jwt';

async function verify(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    try {
        if (!authHeader) {
            return res.status(401).json({ error: "Authorization header not found" });
        }

        const token = authHeader.split(' ')[1]; // Extract the token (usually "Bearer <token>")

        const data = JWTService.decodeToken(token); // Decode or verify the token
        if (!data) {
            return res.status(401).json({ error: "Invalid token" });
        }

        // Assuming the decoded token contains the user object
        req.user = data;

        next();
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized access" });
    }
}

export default verify;
