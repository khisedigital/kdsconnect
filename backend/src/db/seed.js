import {pathToFileURL} from 'node:url';

import {
  Order,
  OrderItem,
  Product,
  ProductCategory,
  Rfq,
  RfqItem,
  SupportQuery,
  User,
} from '../models/index.js';
import {hashPassword} from '../utils/password.js';

const PASSWORD = 'Passw0rd!';

export async function seedIfEmpty() {
  const count = await User.count();
  if (count > 0) {
    return {seeded: false};
  }
  await seed();
  return {seeded: true};
}

export async function seed() {
  const passwordHash = await hashPassword(PASSWORD);

  const admin = await User.create({
    email: 'admin@dev.kdsconnect.local',
    passwordHash,
    role: 'admin',
    displayName: 'Platform Admin',
    businessName: 'Khise Digital',
    phoneVerified: true,
    isActive: true,
  });

  const sales = await User.create({
    email: 'sales@dev.kdsconnect.local',
    passwordHash,
    role: 'sales',
    displayName: 'Field Sales',
    phone: '+919876543210',
    phoneVerified: true,
  });

  const retailer = await User.create({
    email: 'retailer@dev.kdsconnect.local',
    passwordHash,
    role: 'retailer',
    displayName: 'Priya Sharma',
    businessName: 'Sharma Kirana',
    phone: '+919811122233',
    phoneVerified: false,
    onboardedBySalesId: sales.id,
    kycStatus: 'pending',
  });

  const supplier = await User.create({
    email: 'supplier@dev.kdsconnect.local',
    passwordHash,
    role: 'supplier',
    displayName: 'FreshBev Ops',
    businessName: 'FreshBev Wholesale',
    phone: '+919822233344',
    phoneVerified: true,
    businessVerificationStatus: 'pending',
  });

  const beverages = await ProductCategory.create({
    name: 'Beverages',
    slug: 'beverages',
  });
  const staples = await ProductCategory.create({
    name: 'Staples',
    slug: 'staples',
  });

  const cola = await Product.create({
    sku: 'BEV-COLA-24',
    name: 'Cola 330ml (24 pack)',
    description: 'Case of 24 cans',
    categoryId: beverages.id,
    unit: 'case',
    minOrderQuantity: 1,
    priceAmount: 18.5,
    priceCurrency: 'INR',
    supplierId: supplier.id,
    inStock: true,
  });

  await Product.create({
    sku: 'STP-RICE-25',
    name: 'Basmati Rice 25kg',
    categoryId: staples.id,
    unit: 'each',
    minOrderQuantity: 10,
    priceAmount: 22,
    priceCurrency: 'INR',
    supplierId: supplier.id,
    inStock: true,
  });

  const rfq = await Rfq.create({
    retailerId: retailer.id,
    title: 'Monthly beverage restock',
    status: 'submitted',
    dueDate: new Date(Date.now() + 7 * 86_400_000),
  });

  await RfqItem.create({
    rfqId: rfq.id,
    productId: cola.id,
    description: 'Cola 330ml cases',
    quantity: 10,
    unit: 'case',
  });

  const sugarRfq = await Rfq.create({
    retailerId: retailer.id,
    title: 'Bulk sugar 1000 kg',
    status: 'submitted',
  });

  await RfqItem.create({
    rfqId: sugarRfq.id,
    description: 'Refined sugar',
    quantity: 1000,
    unit: 'kg',
  });

  const order = await Order.create({
    retailerId: retailer.id,
    supplierId: supplier.id,
    status: 'confirmed',
    currency: 'INR',
    subtotalAmount: 92.5,
    totalAmount: 92.5,
  });

  await OrderItem.create({
    orderId: order.id,
    productId: cola.id,
    productName: cola.name,
    quantity: 5,
    currency: 'INR',
    unitPriceAmount: 18.5,
    lineTotalAmount: 92.5,
  });

  await SupportQuery.create({
    userId: retailer.id,
    userRole: 'retailer',
    userLabel: retailer.displayName,
    businessName: retailer.businessName,
    category: 'orders',
    subject: 'Order delayed after confirmation',
    message:
      'Order was confirmed two days ago but still shows packing. Can someone check?',
    status: 'open',
  });

  await SupportQuery.create({
    userId: supplier.id,
    userRole: 'supplier',
    userLabel: supplier.displayName,
    businessName: supplier.businessName,
    category: 'quotations',
    subject: 'Cannot submit quote on RFQ',
    message: 'Trying to quote on Bulk sugar 1000 kg but submit fails.',
    status: 'in_progress',
    adminNote: 'Looking into quotation form validation.',
  });

  console.log('Seed complete. Demo password for all users:', PASSWORD);
  console.log('Users:', {
    admin: admin.email,
    sales: sales.email,
    retailer: retailer.email,
    supplier: supplier.email,
  });

  return {admin, sales, retailer, supplier};
}

const isCli =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isCli) {
  const {assertDatabaseConnection} = await import('../config/database.js');
  const {sequelize} = await import('../models/index.js');
  await assertDatabaseConnection();
  await sequelize.sync({alter: true});
  await seed();
  process.exit(0);
}
