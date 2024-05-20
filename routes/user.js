import { Router } from 'express';

import { checkAuth } from '../middleware/checkAuth.js';
import { userController } from '../controllers/index.js';

const router = Router();

router.get('/user', checkAuth, userController.getUserProfile);
router.patch('/user', checkAuth, userController.updateUserProfile);

export default router;
