import {DataTypes, Model} from 'sequelize';

export class ProductCategory extends Model {
  toDTO() {
    return {
      id: this.id,
      name: this.name,
      slug: this.slug,
      parentId: this.parentId ?? undefined,
    };
  }
}

export function initProductCategory(sequelize) {
  ProductCategory.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {type: DataTypes.STRING(120), allowNull: false},
      slug: {type: DataTypes.STRING(140), allowNull: false, unique: true},
      parentId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'parent_id',
      },
    },
    {
      sequelize,
      modelName: 'ProductCategory',
      tableName: 'product_categories',
    },
  );

  return ProductCategory;
}
