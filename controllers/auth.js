import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

import User from '../models/user.js';
import { JWT_SECRET } from '../util/jwt-secret.js';
import erorHelper from '../util/error.js';

export const signUp = async (req, res, next) => {
    const errors = validationResult(req);

    try {
        if (!errors.isEmpty()) {
            const error = new Error('Validation failed.');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        }

        const { email, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 12);
        const newUser = new User({
            email,
            passwordHash,
        });

        const createdUser = await newUser.save();

        const token = jwt.sign(
            {
                userId: createdUser._id,
            },
            JWT_SECRET,
            { expiresIn: '1h' },
        );

        res.status(201).json({
            message: 'User successfully signed up.',
            userId: createdUser._id,
            token,
        });
    } catch (error) {
        erorHelper.generalError(error, next);
    }
};

export const login = async (req, res, next) => {
    // is validation of email and password values are necessary on login?
    // const errors = validationResult(req);

    try {
        // if (!errors.isEmpty()) {
        //     const error = new Error('Validation failed.');
        //     error.statusCode = 422;
        //     error.data = errors.array();
        //     throw error;
        // }

        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error('Login or password incorrect.');
            error.statusCode = 401;
            error.data = [{ path: 'generalError', msg: error.message }];
            throw error;
        }

        const passwordMAtch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMAtch) {
            const error = new Error('Login or password incorrect.');
            error.statusCode = 401;
            error.data = [{ path: 'generalError', msg: error.message }];
            throw error;
        }

        const token = jwt.sign(
            {
                userId: user._id,
            },
            JWT_SECRET,
            { expiresIn: '1h' },
        );

        res.status(200).json({
            message: 'User succesfully logged in.',
            token,
        });
    } catch (error) {
        erorHelper.generalError(error, next);
    }
};
