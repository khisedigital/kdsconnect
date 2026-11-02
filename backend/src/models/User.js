import {DataTypes, Model} from 'sequelize';

export class User extends Model {
  toAuthUser() {
    return {
      id: this.id,
      email: this.email,
      role: this.role,
      displayName: this.displayName,
      businessName: this.businessName ?? undefined,
      phone: this.phone ?? undefined,
      phoneVerified: this.phoneVerified,
      onboardedBySalesId: this.onboardedBySalesId ?? undefined,
    };
  }
}

export function initUser(sequelize) {
  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {isEmail: true},
      },
      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password_hash',
      },
      role: {
        type: DataTypes.ENUM('retailer', 'supplier', 'sales', 'admin'),
        allowNull: false,
      },
      displayName: {
        type: DataTypes.STRING(120),
        allowNull: false,
        field: 'display_name',
      },
      businessName: {
        type: DataTypes.STRING(200),
        allowNull: true,
        field: 'business_name',
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      phoneVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'phone_verified',
      },
      taxId: {
        type: DataTypes.STRING(64),
        allowNull: true,
        field: 'tax_id',
      },
      onboardedBySalesId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'onboarded_by_sales_id',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
      kycStatus: {
        type: DataTypes.ENUM('none', 'pending', 'verified', 'rejected'),
        allowNull: false,
        defaultValue: 'none',
        field: 'kyc_status',
      },
      businessVerificationStatus: {
        type: DataTypes.ENUM('none', 'pending', 'verified', 'rejected'),
        allowNull: false,
        defaultValue: 'none',
        field: 'business_verification_status',
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      indexes: [
        {fields: ['email'], unique: true},
        {fields: ['role']},
        {fields: ['phone']},
      ],
    },
  );

  return User;
}
