import JWT from "jsonwebtoken";
import { User } from "@prisma/client";

export type JWTUser = {
    id: string;
    email: string;
}

class JWTService {

    public static generateTokenForUser(user: User) {
        const payload: JWTUser = {
            id: user?.id,
            email: user?.email!,
        };
        const token = JWT.sign(payload, process.env.JWT_SECRET!, { expiresIn: "7d" });
        return token;
    }

    public static decodeToken(token: string) {
        try {
            return JWT.verify(token, process.env.JWT_SECRET!) as {id:string};
        } catch (error) {
            return null;
        }
    }

}

export default JWTService;