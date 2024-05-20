import { body } from 'express-validator';

import User from '../../models/user.js';

export const signUpValidation = [
    body('email')
        .isEmail()
        .custom(async (value) => {
            const userDoc = await User.findOne({ email: value });
            console.log('userDoc: ', userDoc);
            if (userDoc) {
                throw new Error('User with this email already exist');
            }
        }),
    body('password', 'password must be at least 5 characters long')
        .trim()
        .isString()
        .isLength({ min: 5 }),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),
];

export const loginValidation = [
    body('email').isEmail(),
    body('password').trim().isString().isLength({ min: 5 }),
];
