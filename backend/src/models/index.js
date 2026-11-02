import {sequelize} from '../config/database.js';
import {initUser, User} from './User.js';
import {initRefreshToken, RefreshToken} from './RefreshToken.js';
import {initOtpChallenge, OtpChallenge} from './OtpChallenge.js';
import {initProductCategory, ProductCategory} from './ProductCategory.js';
import {initProduct, Product} from './Product.js';
import {initRfq, Rfq} from './Rfq.js';
import {initRfqItem, RfqItem} from './RfqItem.js';
import {initOrder, Order} from './Order.js';
import {initOrderItem, OrderItem} from './OrderItem.js';
import {initSupportQuery, SupportQuery} from './SupportQuery.js';

initUser(sequelize);
initRefreshToken(sequelize);
initOtpChallenge(sequelize);
initProductCategory(sequelize);
initProduct(sequelize);
initRfq(sequelize);
initRfqItem(sequelize);
initOrder(sequelize);
initOrderItem(sequelize);
initSupportQuery(sequelize);

User.hasMany(RefreshToken, {foreignKey: 'userId', as: 'refreshTokens'});
RefreshToken.belongsTo(User, {foreignKey: 'userId', as: 'user'});

User.hasMany(OtpChallenge, {foreignKey: 'userId', as: 'otpChallenges'});
OtpChallenge.belongsTo(User, {foreignKey: 'userId', as: 'user'});

User.hasMany(Product, {foreignKey: 'supplierId', as: 'products'});
Product.belongsTo(User, {foreignKey: 'supplierId', as: 'supplier'});

ProductCategory.hasMany(Product, {foreignKey: 'categoryId', as: 'products'});
Product.belongsTo(ProductCategory, {foreignKey: 'categoryId', as: 'category'});

User.hasMany(Rfq, {foreignKey: 'retailerId', as: 'rfqs'});
Rfq.belongsTo(User, {foreignKey: 'retailerId', as: 'retailer'});
Rfq.hasMany(RfqItem, {foreignKey: 'rfqId', as: 'items', onDelete: 'CASCADE'});
RfqItem.belongsTo(Rfq, {foreignKey: 'rfqId', as: 'rfq'});

User.hasMany(Order, {foreignKey: 'retailerId', as: 'retailerOrders'});
User.hasMany(Order, {foreignKey: 'supplierId', as: 'supplierOrders'});
Order.belongsTo(User, {foreignKey: 'retailerId', as: 'retailer'});
Order.belongsTo(User, {foreignKey: 'supplierId', as: 'supplier'});
Order.hasMany(OrderItem, {foreignKey: 'orderId', as: 'items', onDelete: 'CASCADE'});
OrderItem.belongsTo(Order, {foreignKey: 'orderId', as: 'order'});

User.hasMany(SupportQuery, {foreignKey: 'userId', as: 'supportQueries'});
SupportQuery.belongsTo(User, {foreignKey: 'userId', as: 'user'});

export {
  sequelize,
  User,
  RefreshToken,
  OtpChallenge,
  ProductCategory,
  Product,
  Rfq,
  RfqItem,
  Order,
  OrderItem,
  SupportQuery,
};
