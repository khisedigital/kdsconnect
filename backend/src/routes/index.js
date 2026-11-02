import {Router} from 'express';

import adminRoutes from './admin.routes.js';
import authRoutes from './auth.routes.js';
import ordersRoutes from './orders.routes.js';
import productsRoutes from './products.routes.js';
import rfqsRoutes from './rfqs.routes.js';
import salesRoutes from './sales.routes.js';
import supplierRoutes from './supplier.routes.js';
import supportRoutes from './support.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ok: true, service: 'kdsconnect-api'});
});

router.use('/auth', authRoutes);
router.use('/products', productsRoutes);
router.use('/rfqs', rfqsRoutes);
router.use('/orders', ordersRoutes);
router.use('/support', supportRoutes);
router.use('/admin', adminRoutes);
router.use('/sales', salesRoutes);
router.use('/supplier', supplierRoutes);

export default router;
