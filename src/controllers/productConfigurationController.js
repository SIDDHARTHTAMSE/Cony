const sequelize = require('../db');

const getProductList = async (req, res) => {
    try {
        const query = `
            SELECT 
                p.product_id AS "Product_ID",
                p.product_name AS "Product_Name",
                c.component_name AS "Component_Name",
                pc.quantity AS "Quantity"
            FROM 
                products p
            LEFT JOIN 
                product_component pc ON p.product_id = pc.product_id
            LEFT JOIN 
                components c ON pc.component_id = c.component_id;
        `;

        const [results] = await sequelize.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching product list:', error);
        res.status(500).json({ message: 'Error fetching product list' });
    }
};

const getOrderManagement = async (req, res) => {
    try {
        const query = `
            SELECT 
                oc.order_config_id AS "Order_ID",
                p.product_name AS "Product_Name",
                oc.order_quantity AS "Order_Quantity",
                c.component_name AS "Component_Name",
                (oc.order_quantity * pc.quantity) AS "Total_Required_Quantity",
                ps.available_quantity AS "Available_Quantity"
            FROM 
                order_config oc
            JOIN 
                products p ON oc.product_id = p.product_id
            JOIN 
                product_component pc ON p.product_id = pc.product_id
            JOIN 
                components c ON pc.component_id = c.component_id
            LEFT JOIN 
                purchase_store ps ON c.component_id = ps.component_id;
        `;

        const [results] = await sequelize.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching order management data:', error);
        res.status(500).json({ message: 'Error fetching order management data' });
    }
};

module.exports = { getOrderManagement, getProductList };

