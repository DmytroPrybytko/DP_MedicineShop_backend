import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../util/jwt-secret.js';

export const checkAuth = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }

    let decodedToken;
    const token = req.headers.authorization.replace(/Bearer\s?/, '');

    try {
        decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return next({ message: 'Not Authenticated.', statusCode: 401 });
    }

    req.userId = decodedToken.userId;
    next();
};
