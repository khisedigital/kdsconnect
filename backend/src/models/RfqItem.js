import {DataTypes, Model} from 'sequelize';

export class RfqItem extends Model {
  toDTO() {
    return {
      id: this.id,
      productId: this.productId ?? undefined,
      description: this.description,
      quantity: this.quantity,
      unit: this.unit ?? undefined,
      targetPrice: this.targetPrice != null ? Number(this.targetPrice) : undefined,
      notes: this.notes ?? undefined,
    };
  }
}

export function initRfqItem(sequelize) {
  RfqItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      rfqId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'rfq_id',
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'product_id',
      },
      description: {type: DataTypes.STRING(300), allowNull: false},
      quantity: {type: DataTypes.DECIMAL(12, 2), allowNull: false},
      unit: {type: DataTypes.STRING(32), allowNull: true},
      targetPrice: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: true,
        field: 'target_price',
      },
      notes: {type: DataTypes.STRING(500), allowNull: true},
    },
    {
      sequelize,
      modelName: 'RfqItem',
      tableName: 'rfq_items',
      updatedAt: false,
    },
  );

  return RfqItem;
}
