import {Router} from 'express';

import * as adminController from '../controllers/admin.controller.js';
import {authenticate, requireRoles} from '../middleware/auth.js';

const router = Router();

router.use(authenticate, requireRoles('admin'));
router.get('/dashboard', adminController.dashboard);
router.get('/orders/active', adminController.activeOrders);
router.get('/rfqs/requested', adminController.requestedQuotations);

export default router;
