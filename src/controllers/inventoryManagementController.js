const sequelize = require('../db');

 const getFinishedGoodsData = async (req, res) => {   
  try {
    const query = `SELECT
    fp.manufactured_date AS "Manufactured_Date",
    p.component_id AS "component_id",
    p.component_name AS "component_name",
    c.category_name AS "Component_Category",
    fp.manufactured_quantity AS "Manufactured_Quantity",
    fs.available_quantity AS "Available_Quantity"
    FROM
    finished_Components fp 
    INNER JOIN Components p ON fp.component_id = p.component_id
    INNER JOIN categories c ON p.category_id = c.category_id 
    LEFT JOIN finished_store fs ON fs.finished_component_id = fp.finished_component_id`;     
    const [results] = await sequelize.query(query);     
    res.json(results);   
  } catch (error) {
         console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Error fetching Component data' }); 
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
        purchase_store ps ON ps.purchase_id = p.component_id
`;
 
    const [results] = await sequelize.query(query);
 
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching inventory data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getFinishedGoodsData, getRawMaterialInventoryData };



