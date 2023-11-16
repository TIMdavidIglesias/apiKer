import jwt from 'jsonwebtoken'

export const signToken = async (payload: any, secretKey: string) => {
    return jwt.sign(payload, secretKey);
};

export const verifyToken = async (token: any, secretKey: string) => {
    return jwt.verify(token, secretKey);
};