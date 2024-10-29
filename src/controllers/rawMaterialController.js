const { Product, Category, PurchaseStore } = require('../models'); // Import models

const getInventoryData = async (req, res) => {
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
      Product_id: item.product_id,
      Product_Name: item.product_name,
      Product_Category: item.Category.category_name,
      Available_Quantity: item.PurchaseStore.available_quantity,
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching inventory data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getInventoryData };
