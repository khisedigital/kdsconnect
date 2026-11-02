import {DataTypes, Model} from 'sequelize';

export class OrderItem extends Model {
  toDTO() {
    return {
      id: this.id,
      productId: this.productId,
      productName: this.productName,
      quantity: Number(this.quantity),
      unitPrice: {
        amount: Number(this.unitPriceAmount),
        currency: this.currency,
      },
      lineTotal: {
        amount: Number(this.lineTotalAmount),
        currency: this.currency,
      },
    };
  }
}

export function initOrderItem(sequelize) {
  OrderItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'order_id',
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'product_id',
      },
      productName: {
        type: DataTypes.STRING(200),
        allowNull: false,
        field: 'product_name',
      },
      quantity: {type: DataTypes.DECIMAL(12, 2), allowNull: false},
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'INR',
      },
      unitPriceAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        field: 'unit_price_amount',
      },
      lineTotalAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        field: 'line_total_amount',
      },
    },
    {
      sequelize,
      modelName: 'OrderItem',
      tableName: 'order_items',
      updatedAt: false,
    },
  );

  return OrderItem;
}
