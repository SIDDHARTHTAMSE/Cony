const sequelize = require('../db');

const getFinishedGoodsData = async (req, res) => {   
  try {
    const query = `
      SELECT
        fp.manufactured_date AS "Manufactured_Date",
        p.component_id AS "component_id",
        p.component_name AS "component_name",
        c.category_name AS "Component_Category",
        fp.manufactured_quantity AS "Manufactured_Quantity",
        fs.available_quantity AS "Available_Quantity"
      FROM
        finished_products fp
      INNER JOIN product_component pc ON fp.product_id = pc.product_id
      INNER JOIN components p ON pc.component_id = p.component_id
      INNER JOIN categories c ON p.category_id = c.category_id
      LEFT JOIN finished_store fs ON fs.product_id = fp.product_id
    `;
    const [results] = await sequelize.query(query);
    res.json(results);   
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error fetching finished goods data' }); 
  }
};

 const getRawMaterialInventoryData = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.component_id AS "component_id",
        p.component_name AS "component_name",
        c.category_name AS "Component_Category",
        ps.available_quantity AS "Available_Quantity"
      FROM 
        Components p
      INNER JOIN 
        categories c ON p.category_id = c.category_id
      LEFT JOIN 
        purchase_store ps ON ps.component_id = p.component_id`;
 
    const [results] = await sequelize.query(query);
 
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching inventory data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getFinishedGoodsData, getRawMaterialInventoryData };



