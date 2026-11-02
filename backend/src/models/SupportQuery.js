import {DataTypes, Model} from 'sequelize';

export class SupportQuery extends Model {
  toDTO() {
    return {
      id: this.id,
      userId: this.userId,
      userRole: this.userRole,
      userLabel: this.userLabel,
      businessName: this.businessName ?? undefined,
      category: this.category,
      subject: this.subject,
      message: this.message,
      status: this.status,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      adminNote: this.adminNote ?? undefined,
    };
  }
}

export function initSupportQuery(sequelize) {
  SupportQuery.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
      },
      userRole: {
        type: DataTypes.ENUM('retailer', 'supplier', 'sales', 'admin'),
        allowNull: false,
        field: 'user_role',
      },
      userLabel: {
        type: DataTypes.STRING(120),
        allowNull: false,
        field: 'user_label',
      },
      businessName: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'business_name',
      },
      category: {
        type: DataTypes.ENUM(
          'orders',
          'quotations',
          'account',
          'payments',
          'other',
        ),
        allowNull: false,
        defaultValue: 'other',
      },
      subject: {type: DataTypes.STRING(160), allowNull: false},
      message: {type: DataTypes.TEXT, allowNull: false},
      status: {
        type: DataTypes.ENUM('open', 'in_progress', 'resolved'),
        allowNull: false,
        defaultValue: 'open',
      },
      adminNote: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'admin_note',
      },
    },
    {
      sequelize,
      modelName: 'SupportQuery',
      tableName: 'support_queries',
      indexes: [{fields: ['user_id']}, {fields: ['status']}],
    },
  );

  return SupportQuery;
}
