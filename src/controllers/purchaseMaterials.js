const sequelize = require('../db');

const getPurchaseMaterials = async (req, res) => {
    try {
      const query = `
        SELECT
          p.purchase_id AS "Purchase_ID",
          p.purchase_date AS "Purchase_Date",
          c.component_name AS "Component_Name",
          cat.category_name AS "Component_Category"
        FROM
          purchases p
        INNER JOIN components c ON p.component_id = c.component_id
        LEFT JOIN categories cat ON c.category_id = cat.category_id
      `;
      
      const [results] = await sequelize.query(query);
      res.json(results);
    } catch (error) {
      console.error('Error fetching purchase data:', error);
      res.status(500).json({ message: 'Error fetching purchase data' });
    }
  };
  
module.exports = { getPurchaseMaterials };