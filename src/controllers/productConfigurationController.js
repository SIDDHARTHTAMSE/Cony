const sequelize = require('../db');

const getProductList = async (req, res) => {
    try {
        const query = `
            SELECT 
                p.product_id AS "Product_ID",
                p.product_name AS "Product_Name",
                c.component_id AS "Component_ID",
                c.component_name AS "Component_Name",
                CASE WHEN pc.component_id IS NOT NULL THEN pc.quantity ELSE 0 END AS "Component_Quantity",
                sc.subcomponents_id AS "Subcomponent_ID",
                sc.subcomponents_name AS "Subcomponent_Name",
                pc.quantity AS "Subcomponent_Quantity"
            FROM 
                product_component pc
            INNER JOIN 
                products p ON pc.product_id = p.product_id
            LEFT JOIN 
                components c ON pc.component_id = c.component_id
            LEFT JOIN 
                subcomponents sc ON pc.subcomponents_id = sc.subcomponents_id
            WHERE 
                pc.quantity > 0
            ORDER BY 
                p.product_id, c.component_id, sc.subcomponents_id;
        `;

        const [results] = await sequelize.query(query);

        const productMap = {};

        results.forEach(row => {
            const {
                Product_ID: productId,
                Product_Name: productName,
                Component_ID: componentId,
                Component_Name: componentName,
                Component_Quantity: componentQuantity,
                Subcomponent_ID: subcomponentId,
                Subcomponent_Name: subcomponentName,
                Subcomponent_Quantity: subcomponentQuantity
            } = row;

            // Add product if not present
            if (!productMap[productId]) {
                productMap[productId] = {
                    product_id: productId,
                    product_name: productName,
                    components: []
                };
            }

            // Handle components correctly
            let component = productMap[productId].components.find(c => c.component_id === componentId);
            if (!component) {
                component = {
                    component_id: componentId || null,
                    component_name: componentName || 'N/A',
                    component_quantity: componentQuantity || 0,
                    subcomponents: []
                };
                productMap[productId].components.push(component);
            }

            // Add subcomponents if present
            if (subcomponentId) {
                component.subcomponents.push({
                    subcomponent_id: subcomponentId,
                    subcomponent_name: subcomponentName,
                    subcomponent_quantity: subcomponentQuantity
                });
            }
        });

        const formattedProducts = Object.values(productMap);

        res.status(200).json(formattedProducts);
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
                oc.product_id AS "Product_ID",
                p.product_name AS "Product_Name",
                oc.order_quantity AS "Order_Quantity",
                oc.is_confirmed AS "Is_Confirmed",
                c.component_id AS "Component_ID",
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

        const formattedData = results.reduce((acc, row) => {
            let order = acc.find(o => o.order_id === row.Order_ID);

            if (!order) {
                order = {
                    order_id: row.Order_ID,
                    product_id: row.Product_ID,
                    product_name: row.Product_Name,
                    order_quantity: row.Order_Quantity,
                    is_confirmed: row.Is_Confirmed,
                    components: []
                };
                acc.push(order);
            }

            const existingComponent = order.components.find(c => c.componentId === row.Component_ID);
            if(!existingComponent){
                order.components.push({
                    component_id: row.Component_ID,
                    component_name: row.Component_Name,
                    required_quantity: row.Total_Required_Quantity,
                    available_quantity: row.Available_Quantity
                });
            }

            return acc;
        }, []);

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching order management data:', error);
        res.status(500).json({ message: 'Error fetching order management data' });
    }
};

module.exports = { getOrderManagement, getProductList };

