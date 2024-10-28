import { Request, Response, NextFunction } from 'express';
import JWTService from './jwt';

async function verify(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.cookies.token;
    // console.log(req.headers);
    // console.log(req.headers.token);
    // console.log("cookies :",req.cookies);
    // console.log("cookies :",req.cookies.token);

    
    try {
        if (!authHeader) {
            res.status(401).json({ error: "Token header not found" });
            return;
        }

        const token = authHeader.toString();

        const data = JWTService.decodeToken(token); // Decode or verify the token
        if (!data) {
            res.status(401).json({ error: "Invalid token" });
            return;

        }

        // Assuming the decoded token contains the user object
        req.user = data;

        next();
    } catch (err) {
        res.status(401).json({ error: "Unauthorized access" });
        return;
    }
}

export default verify;
