const sequelize = require('../db');

const getFinishedGoodsData = async (req, res) => {   
  try {
    const query = `
      SELECT
        fp.manufactured_date AS "Manufactured_Date",
        fp.finished_product_id AS "Finished_Product_Id",
        p.product_id AS "Product_Id",
        p.product_name AS "Product_Name",
        fp.manufactured_quantity AS "Manufactured_Quantity",
        fs.available_quantity AS "Available_Quantity"
      FROM
        finished_products fp
        LEFT JOIN finished_store fs ON fs.product_id = fp.product_id
        INNER JOIN products p ON fs.product_id = p.product_id;
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
        p.component_id AS "Component_ID",
        p.component_name AS "Component_Name",
        c.category_name AS "Component_Category",
        COALESCE(ps.available_quantity, 0) AS "Available_Quantity",
        sc.subcomponents_id AS "Subcomponent_ID",
        sc.subcomponents_name AS "Subcomponent_Name",
        COALESCE(SUM(scs.quantity), 0) AS "Subcomponent_Quantity"
      FROM 
        components p
      INNER JOIN 
        categories c ON p.category_id = c.category_id
      LEFT JOIN 
        purchase_store ps ON ps.component_id = p.component_id
      LEFT JOIN 
        subcomponents sc ON sc.component_id = p.component_id
      LEFT JOIN 
        subcomponentstore scs ON scs.subcomponents_id = sc.subcomponents_id
      WHERE 
        p.is_deleted = false
      GROUP BY
        p.component_id, p.component_name, c.category_name, ps.available_quantity, sc.subcomponents_id, sc.subcomponents_name
      ORDER BY 
        p.component_id, sc.subcomponents_id;
    `;

    const [results] = await sequelize.query(query);

    // Transform the results into the desired array structure
    const formattedData = results.reduce((acc, item) => {
      const { Component_ID, Component_Name, Component_Category, Available_Quantity, Subcomponent_ID, Subcomponent_Name, Subcomponent_Quantity } = item;

      // Check if the component already exists in the accumulator
      let component = acc.find(c => c.Component_ID === Component_ID);
      if (!component) {
        component = {
          Component_ID,
          Component_Name,
          Component_Category,
          Available_Quantity,
          Subcomponents: []
        };
        acc.push(component);
      }

      // Add the subcomponent if it exists
      if (Subcomponent_ID) {
        component.Subcomponents.push({
          Subcomponent_ID,
          Subcomponent_Name,
          Subcomponent_Quantity
        });
      }

      return acc;
    }, []);

    res.status(200).json(formattedData);
  } catch (error) {
    console.error('Error fetching inventory data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { getFinishedGoodsData, getRawMaterialInventoryData };



