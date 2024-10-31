const sequelize = require('../db');

 const getFinishedGoodsData = async (req, res) => {   
  try {
    const query = `SELECT
    fp.manufactured_date AS "Manufactured_Date",
    p.product_id AS "Product_ID",
    p.product_name AS "Product_Name",
    c.category_name AS "Product_Category",
    fp.manufactured_quantity AS "Manufactured_Quantity",
    fs.available_quantity AS "Available_Quantity"
    FROM
    finished_products fp 
    INNER JOIN products p ON fp.product_id = p.product_id
    INNER JOIN categories c ON p.category_id = c.category_id 
    LEFT JOIN finished_store fs ON fs.finished_product_id = fp.finished_product_id`;     
    const [results] = await sequelize.query(query);     
    res.json(results);   
  } catch (error) {
         console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Error fetching product data' }); 
  }
 };

 const getRawMaterialInventoryData = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.product_id AS "Product_ID",
        p.product_name AS "Product_Name",
        c.category_name AS "Product_Category",
        ps.available_quantity AS "Available_Quantity"
      FROM 
        products p
      INNER JOIN 
        categories c ON p.category_id = c.category_id
      LEFT JOIN 
        purchase_store ps ON ps.purchase_id = p.product_id
`;
 
    const [results] = await sequelize.query(query);
 
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching inventory data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getFinishedGoodsData, getRawMaterialInventoryData };



