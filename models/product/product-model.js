const Sequelize = require('sequelize');
const sequelize = require('../../utils/database-connection');

const ProductModel = sequelize.define('product', {
    id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'is_active'
    },
    organizationId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        field: 'organization_id'
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    code: {
        type: Sequelize.STRING,
        allowNull: false
    },
    productLineId: {
        type: Sequelize.BIGINT,
        field: 'product_line_id'
    },
    productBrandId: {
        type: Sequelize.BIGINT,
        field: 'product_brand_id'
    },
    productGroupId: {
        type: Sequelize.BIGINT,
        field: 'product_group_id'
    },
    productTypeId: {
        type: Sequelize.BIGINT,
        field: 'product_type_id'
    },
    onlyPromotional: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'only_promotional'
    },
    vat: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0
    },
    maxRetailPrice: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
        field: 'max_retail_price'
    },
    tradePrice: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0,
        field: 'trade_price'
    },
    discountApplicable: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'discount_applicable'
    },
    description: Sequelize.STRING,
    minDiscount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
        field: 'min_discount'
    },
    maxDiscount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
        field: 'max_discount'
    },
    defaultDiscount: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
        field: 'default_discount'
    },
    minDiscountForDistributor: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
        field: 'min_discount_for_distributor'
    },
    maxDiscountForDistributor: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
        field: 'max_discount_for_distributor'
    },
    defaultDiscountForDistributor: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue: 0.0,
        field: 'default_discount_for_distributor'
    },
    retailerPrice: {
        type: Sequelize.DOUBLE,
        defaultValue: 0.0,
        field: 'retailer_price'
    },
    rpVat: {
        type: Sequelize.DOUBLE,
        defaultValue: 0.0,
        field: 'rp_vat'
    },
    availableForPrimaryOrder: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        field: 'available_for_primary_order'
    },
    availableForSecondaryOrder: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        field: 'available_for_secondary_order'
    },
    packSize: {
        type: Sequelize.DOUBLE,
        defaultValue: 1,
        field: 'pack_size'
    },
    unitVolume: {
        type: Sequelize.DOUBLE,
        defaultValue: 1,
        field: 'unit_volume'
    },
    measurementUnit: {
        type: Sequelize.STRING,
        field: 'measurement_unit'
    },
    minDiscountAmountForDb: {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
        field: 'min_discount_amount_for_db'
    },
    maxDiscountAmountForDb: {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
        field: 'max_discount_amount_for_db'
    },
    defaultDiscountAmountForDb: {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
        field: 'default_discount_amount_for_db'
    },
    minDiscountAmountForRetailer: {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
        field: 'min_discount_amount_for_retailer'
    },
    maxDiscountAmountForRetailer: {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
        field: 'max_discount_amount_for_retailer'
    },
    defaultDiscountAmountForRetailer: {
        type: Sequelize.DOUBLE,
        defaultValue: 0,
        field: 'default_discount_amount_for_retailer'
    },
    distributorOrderQuantity: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'distributor_order_quantity'
    },
    distributorPriceFormula: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'distributor_price_formula'
    },
    retailerOrderQuantity: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'retailer_order_quantity'
    },
    retailerPriceFormula: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'retailer_price_formula'
    },
    measurementUnitOfPack: {
        type: Sequelize.STRING,
        field: 'measurement_unit_of_pack'
    },
    measurementUnitOfUnit: {
        type: Sequelize.STRING,
        field: 'measurement_unit_of_unit'
    }
}, {
    tableName: 'products',
    schema: 'public',
    timestamps: false,
});

module.exports = ProductModel;