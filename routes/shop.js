import { Router } from 'express';

import { shopController } from '../controllers/index.js';
import { checkAuth } from '../middleware/checkAuth.js';

const router = Router();

router.get('/products', shopController.getAllProducts);

router.get('/product/:productId', shopController.getProduct);

router.get('/shop', shopController.getAllShops);

router.get('/categories', shopController.getAllCategories);

router.get('/sortingrules', shopController.getAllSortingRules);

// GET get product list for shop
router.get('/shop/:shopId', shopController.getShopProducts);

//GET categories list for shop
// router.get('/shop/:shopId/categories', shopController.getShopCategories);
router.get('/order', checkAuth, shopController.getOrderHistory);
router.post('/order', shopController.postOrder);

export default router;
