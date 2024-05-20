import { body } from 'express-validator';

export const orderBillingValidation = [
    body('customerName').trim().not().isEmpty(),
    body('email').trim().isEmail(),
    body('address').trim().not().isEmpty(),
    body('phone').trim().not().isEmpty(),
];
