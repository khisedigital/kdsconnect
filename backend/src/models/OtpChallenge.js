import {DataTypes, Model} from 'sequelize';

export class OtpChallenge extends Model {}

export function initOtpChallenge(sequelize) {
  OtpChallenge.init(
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
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      purpose: {
        type: DataTypes.ENUM('mobile_verify', 'password_reset'),
        allowNull: false,
      },
      codeHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'code_hash',
      },
      attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expires_at',
      },
      consumedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'consumed_at',
      },
    },
    {
      sequelize,
      modelName: 'OtpChallenge',
      tableName: 'otp_challenges',
      updatedAt: false,
      indexes: [{fields: ['user_id', 'purpose']}],
    },
  );

  return OtpChallenge;
}
