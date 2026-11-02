import {DataTypes, Model} from 'sequelize';

export class Product extends Model {
  toDTO() {
    return {
      id: this.id,
      sku: this.sku,
      name: this.name,
      description: this.description ?? undefined,
      categoryId: this.categoryId,
      unit: this.unit,
      minOrderQuantity: this.minOrderQuantity,
      price: {
        amount: Number(this.priceAmount),
        currency: this.priceCurrency,
      },
      supplierId: this.supplierId,
      imageUrl: this.imageUrl ?? undefined,
      inStock: this.inStock,
    };
  }
}

export function initProduct(sequelize) {
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      sku: {type: DataTypes.STRING(64), allowNull: false, unique: true},
      name: {type: DataTypes.STRING(200), allowNull: false},
      description: {type: DataTypes.TEXT, allowNull: true},
      categoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'category_id',
      },
      unit: {
        type: DataTypes.ENUM('each', 'case', 'kg', 'lb', 'liter'),
        allowNull: false,
        defaultValue: 'case',
      },
      minOrderQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        field: 'min_order_quantity',
      },
      priceAmount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        field: 'price_amount',
      },
      priceCurrency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'INR',
        field: 'price_currency',
      },
      supplierId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'supplier_id',
      },
      imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'image_url',
      },
      inStock: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'in_stock',
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active',
      },
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'products',
      indexes: [
        {fields: ['sku'], unique: true},
        {fields: ['supplier_id']},
        {fields: ['category_id']},
      ],
    },
  );

  return Product;
}
