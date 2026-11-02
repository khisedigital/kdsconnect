import {DataTypes, Model} from 'sequelize';

export class Order extends Model {
  toDTO() {
    return {
      id: this.id,
      retailerId: this.retailerId,
      supplierId: this.supplierId,
      status: this.status,
      items: (this.items ?? []).map(item => item.toDTO()),
      subtotal: {
        amount: Number(this.subtotalAmount),
        currency: this.currency,
      },
      shipping:
        this.shippingAmount != null
          ? {amount: Number(this.shippingAmount), currency: this.currency}
          : undefined,
      total: {
        amount: Number(this.totalAmount),
        currency: this.currency,
      },
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

export function initOrder(sequelize) {
  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      retailerId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'retailer_id',
      },
      supplierId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'supplier_id',
      },
      status: {
        type: DataTypes.ENUM(
          'pending',
          'confirmed',
          'processing',
          'shipped',
          'delivered',
          'cancelled',
        ),
        allowNull: false,
        defaultValue: 'pending',
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'INR',
      },
      subtotalAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        field: 'subtotal_amount',
      },
      shippingAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        field: 'shipping_amount',
      },
      totalAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        field: 'total_amount',
      },
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'orders',
      indexes: [
        {fields: ['retailer_id']},
        {fields: ['supplier_id']},
        {fields: ['status']},
      ],
    },
  );

  return Order;
}
