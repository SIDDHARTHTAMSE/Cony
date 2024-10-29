const { Product} = require('../models/Product'); 
const { Category} = require('../models/Category');
const { FinishedProduct} = require('../models/FinishedProduct');
const { FinishedStore } = require('../models/finishedStore');
const { PurchaseStore } = require('../models/purchasedStore');

const getFinishedGoodsData = async (req, res) => {
  try {
    const finishedGoodsData = await FinishedProduct.findAll({
      attributes: ['manufactured_date', 'manufactured_quantity'],
      include: [
        {
          model: Product,
          attributes: ['product_id', 'product_name'],
          include: {
            model: Category,
            attributes: ['category_name'],
          },
        },
        {
          model: FinishedStore,
          attributes: ['available_quantity'],
        },
      ],
    });

    const formattedData = finishedGoodsData.map((item) => ({
      Manufacture_Date: item?.manufactured_date,
      Product_ID: item.Product?.product_id,
      Product_Name: item?.Product?.product_name,
      Product_Category: item?.Product?.Category?.category_name,
      Manufacture_Quantity: item?.manufactured_quantity,
      Available_Quantity: item?.FinishedStore?.available_quantity,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching finished goods data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getRawMaterialInventoryData = async (req, res) => {
  try {
    const inventoryData = await Product.findAll({
      attributes: ['product_id', 'product_name'],
      include: [
        {
          model: Category,
          attributes: ['category_name'],
        },
        {
          model: PurchaseStore,
          attributes: ['available_quantity'],
        },
      ],
    });

    const formattedData = inventoryData.map((item) => ({
      Product_id: item?.product_id,
      Product_Name: item?.product_name,
      Product_Category: item?.Category?.category_name,
      Available_Quantity: item?.PurchaseStore?.available_quantity,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching inventory data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getFinishedGoodsData, getRawMaterialInventoryData };



