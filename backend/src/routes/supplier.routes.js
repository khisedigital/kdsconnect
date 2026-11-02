import {Router} from 'express';

import * as supplierController from '../controllers/supplier.controller.js';
import {authenticate, requireRoles} from '../middleware/auth.js';

const router = Router();

router.use(authenticate, requireRoles('supplier'));
router.get('/dashboard', supplierController.dashboard);
router.get('/products', supplierController.products);
router.get('/orders', supplierController.orders);

export default router;
