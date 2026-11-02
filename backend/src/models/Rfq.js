import {DataTypes, Model} from 'sequelize';

export class Rfq extends Model {
  toDTO() {
    return {
      id: this.id,
      retailerId: this.retailerId,
      title: this.title,
      status: this.status,
      items: (this.items ?? []).map(item => item.toDTO()),
      dueDate: this.dueDate ? this.dueDate.toISOString() : undefined,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

export function initRfq(sequelize) {
  Rfq.init(
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
      title: {type: DataTypes.STRING(200), allowNull: false},
      status: {
        type: DataTypes.ENUM(
          'draft',
          'submitted',
          'quoted',
          'awarded',
          'cancelled',
          'expired',
        ),
        allowNull: false,
        defaultValue: 'draft',
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'due_date',
      },
    },
    {
      sequelize,
      modelName: 'Rfq',
      tableName: 'rfqs',
      indexes: [{fields: ['retailer_id']}, {fields: ['status']}],
    },
  );

  return Rfq;
}
