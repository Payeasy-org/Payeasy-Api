import { Request, Response, NextFunction } from 'express';
import { authUtil } from '@user/utils/auth.util';
import { UnAuthorizedError } from '@/core';
import { AppMessages } from '@/core/common';

export interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const authenticateJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];


        if (!authHeader) {
            throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED);
        }

        let token: string;

        if (authHeader.startsWith('jwt ')) {
            token = authHeader.substring(4); // Remove 'jwt ' prefix
        } else if (authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7); // Remove 'Bearer ' prefix
        } else {
            token = authHeader; // Assume token without prefix
        }

        const tokenBlacklisted = await authUtil.isTokenBlacklisted(token);
        if (tokenBlacklisted) {
            throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED);
        }

        const tokenPayload = await authUtil._extractTokenDetails(token, process.env.ACCESS_TOKEN_SECRET || '');

        // Adjusted to handle type differences in tokenPayload
        const userId =tokenPayload.id 

        if (!userId) {
            throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED);
        }

        req.userId = userId;

        next();
    } catch (error) {
        next(error);
    }
};
