import { Router } from 'express';
import { authController } from '../controllers/index.js';
import { authValidators } from '../middleware/validation/index.js';
import { checkAuth } from '../middleware/checkAuth.js';

const router = Router();

router.post('/signup', authValidators.signUpValidation, authController.signUp);
router.post('/login', authValidators.loginValidation, authController.login);

//test route
router.get('/check', checkAuth, (req, res, next) => {
    res.status(200).json({ message: 'User ok!' });
});

export default router;
