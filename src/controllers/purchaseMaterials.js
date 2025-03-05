const sequelize = require('../db');
const OrderConfig = require('../models/orderConfig');
const FinishedStore = require('../models/finishedStore');
const Product =  require('../models/products');

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


  const getComponentWithSubComponents = async (req, res) => {
    try {
        const query = `
            SELECT 
                cat.category_name AS "Category_Name",
                c.component_id AS "Component_Id",
                c.component_name AS "Component_Name",
                sc.subcomponents_name AS "SubComponent_Name"
            FROM 
                components c
            LEFT JOIN 
                subcomponents sc ON c.component_id = sc.component_id
            LEFT JOIN 
                categories cat ON c.category_id = cat.category_id
            WHERE 
                c.is_deleted = FALSE 
                AND (sc.is_deleted = FALSE OR sc.is_deleted IS NULL)
                AND cat.is_deleted = FALSE
            ORDER BY 
                cat.category_name, c.component_name, sc.subcomponents_name;
        `;

        const [results] = await sequelize.query(query);

        const formattedResults = results.reduce((acc, row) => {
            let category = acc.find(cat => cat.category_name === row.Category_Name);
            if (!category) {
                category = {
                    category_name: row.Category_Name,
                    components: [],
                };
                acc.push(category);
            }

            let component = category.components.find(comp => comp.component_id === row.Component_Id);
            if (!component) {
                component = {
                    component_id: row.Component_Id,  
                    component_name: row.Component_Name,
                    subcomponents: [],
                };
                category.components.push(component);
            }

            if (row.SubComponent_Name) {
                component.subcomponents.push(row.SubComponent_Name);
            }

            return acc;
        }, []);

        res.json(formattedResults);
    } catch (error) {
        console.error('Error fetching component data:', error);
        res.status(500).json({ message: 'Error fetching component data' });
    }
};


const getPurchaseRequirements = async (req, res) => {
    try {
        const query = `
            SELECT
                COALESCE(c.component_id, sc.component_id) AS "Component_ID", 
                COALESCE(c.component_name, c2.component_name) AS "Component_Name",
                MAX(COALESCE(ps.available_quantity, 0)) AS "Available_Quantity",
                GREATEST(
                    COALESCE(SUM(pc.quantity * oc.order_quantity), 0) - MAX(COALESCE(ps.available_quantity, 0)),
                    0
                ) AS "Purchased_Required_Quantity",
                sc.subcomponents_id AS "Subcomponent_ID",
                sc.subcomponents_name AS "Subcomponent_Name",
                MAX(COALESCE(ss.quantity, 0)) AS "Subcomponent_Available_Quantity",
                GREATEST(
                    COALESCE(SUM(pc.quantity * oc.order_quantity), 0) - MAX(COALESCE(ss.quantity, 0)),
                    0	
                ) AS "Subcomponent_Purchased_Required_Quantity"
            FROM
                order_config oc
            JOIN
                product_component pc ON oc.product_id = pc.product_id
            LEFT JOIN
                components c ON pc.component_id = c.component_id
            LEFT JOIN
                purchase_store ps ON c.component_id = ps.component_id
            LEFT JOIN
                subcomponents sc ON pc.subcomponents_id = sc.subcomponents_id
            LEFT JOIN
                subcomponentstore ss ON sc.subcomponents_id = ss.subcomponents_id
            LEFT JOIN
                components c2 ON sc.component_id = c2.component_id
            GROUP BY 
                c.component_id, c.component_name,
                sc.subcomponents_id, sc.subcomponents_name, c2.component_id, c2.component_name
            ORDER BY "Component_ID";
        `;

        const [results] = await sequelize.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching purchase requirement data:', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
};

const getOrderRequirements = async (req, res) => {
    try {
        const query = `
            SELECT
                oc.order_config_id AS "Order_ID", 
                p.product_name AS "Product_Name",
                oc.order_quantity AS "Order_Quantity",
                COALESCE(fs.available_quantity, 0) AS "Available_Quantity",
                oc."createdAt" AS "Order_Date",
                CASE 
                    WHEN oc.is_confirmed = TRUE AND oc.status = TRUE THEN oc."updatedAt"
                    ELSE NULL
                END AS "Delivered_Date",
                CASE
                    WHEN oc.order_quantity > fs.available_quantity THEN (oc.order_quantity - fs.available_quantity)
                    ELSE 0
                END AS "Remaining_Required_Quantity",
                oc.status AS "Status",
                oc.is_confirmed AS "Is_confirmed"
            FROM 
                order_config oc
            JOIN 
                products p ON oc.product_id = p.product_id
            LEFT JOIN 
                finished_store fs ON p.product_id = fs.product_id;
        `;

        const [results] = await sequelize.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching order requirement data:', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
};

const getComponentDetails = async (req, res) => {
    try {
        const query = `
WITH ComponentData AS (
    SELECT 
        oc.order_config_id AS Order_Id,
        pc.product_id AS Product_Id,
        c.component_id AS Component_Id,
        c.component_name AS Component_Name,
        COALESCE(SUM(pc.quantity * oc.order_quantity), 0) AS Required_Quantity,
        COALESCE(ps.available_quantity, 0) AS Available_Quantity,
        GREATEST(
            COALESCE(SUM(pc.quantity * oc.order_quantity), 0) - COALESCE(ps.available_quantity, 0), 0
        ) AS Shortage,
        CAST(COALESCE(ps.available_quantity, 0) AS TEXT) AS Raw_Material_Available,     
        GREATEST(
            COALESCE(SUM(pc.quantity * oc.order_quantity), 0) - COALESCE(ps.available_quantity, 0), 0
        ) AS Purchase_Order_Required,
        NULL::INTEGER AS Subcomponent_Id,
        NULL::TEXT AS Subcomponent_Name
    FROM components c
    LEFT JOIN product_component pc ON c.component_id = pc.component_id       
    LEFT JOIN order_config oc ON pc.product_id = oc.product_id  
    LEFT JOIN purchase_store ps ON c.component_id = ps.component_id
    WHERE oc.is_confirmed = false
    GROUP BY oc.order_config_id, pc.product_id, c.component_id, c.component_name, ps.available_quantity
),

SubcomponentData AS (
    SELECT 
        oc.order_config_id AS Order_Id,
        pc.product_id AS Product_Id,
        c.component_id AS Component_Id,
        c.component_name AS Component_Name,
        COALESCE(SUM(pc.quantity * oc.order_quantity), 0) AS Required_Quantity,
        COALESCE(ss.quantity, 0) AS Available_Quantity,
        GREATEST(
            COALESCE(SUM(pc.quantity * oc.order_quantity), 0) - COALESCE(ss.quantity, 0), 0
        ) AS Shortage,
        CAST(COALESCE(ps.available_quantity, 0) AS TEXT) AS Raw_Material_Available,     
        GREATEST(
            COALESCE(SUM(pc.quantity * oc.order_quantity), 0) - COALESCE(ss.quantity, 0) - COALESCE(ps.available_quantity, 0), 0
        ) AS Purchase_Order_Required,
        sc.subcomponents_id::INTEGER AS Subcomponent_Id,
        sc.subcomponents_name AS Subcomponent_Name
    FROM product_component pc
    JOIN order_config oc ON oc.product_id = pc.product_id  
    JOIN subcomponents sc ON sc.subcomponents_id = pc.subcomponents_id
    LEFT JOIN subcomponentstore ss ON ss.subcomponents_id = pc.subcomponents_id
    LEFT JOIN purchase_store ps ON sc.component_id = ps.component_id
    JOIN components c ON c.component_id = sc.component_id
    WHERE oc.is_confirmed = false AND pc.quantity > 0
    GROUP BY oc.order_config_id, pc.product_id, c.component_id, c.component_name, sc.subcomponents_id, sc.subcomponents_name, ss.quantity, ps.available_quantity
)

SELECT 
    Order_Id,
    Product_Id,
    Component_Id, 
    Component_Name, 
    Required_Quantity, 
    Available_Quantity, 
    Shortage, 
    Raw_Material_Available, 
    Purchase_Order_Required, 
    Subcomponent_Id, 
    Subcomponent_Name
FROM ComponentData

UNION ALL

SELECT 
    Order_Id,
    Product_Id,
    Component_Id, 
    Component_Name, 
    Required_Quantity, 
    Available_Quantity, 
    Shortage, 
    Raw_Material_Available, 
    Purchase_Order_Required, 
    Subcomponent_Id, 
    Subcomponent_Name
FROM SubcomponentData

ORDER BY Order_Id, Product_Id, Component_Id, Subcomponent_Id;
`;

        const [results] = await sequelize.query(query);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error fetching component details:", error);
        res.status(500).json({ message: "Error fetching data" });
    }
};


const getAllComponentDetails = async (req, res) => {
    try {
        const query = `
            SELECT 
                oc.order_config_id AS "Order_Id",
                c.component_id AS "Component_Id",
                c.component_name AS "Component_Name",
                COALESCE(ps.available_quantity, 0) AS "Available_Quantity",
                GREATEST(SUM(pc.quantity * oc.order_quantity) - COALESCE(ps.available_quantity, 0), 0) AS "Shortage",
                GREATEST(SUM(pc.quantity * oc.order_quantity) - COALESCE(ps.available_quantity, 0), 0) AS "Purchase_Order_Required"
            FROM 
                components c
            LEFT JOIN 
                product_component pc ON c.component_id = pc.component_id
            LEFT JOIN 
                order_config oc ON pc.product_id = oc.product_id
            LEFT JOIN 
                purchase_store ps ON c.component_id = ps.component_id
            GROUP BY 
                oc.order_config_id, c.component_id, c.component_name, ps.available_quantity;
        `;

        const [results] = await sequelize.query(query);
        res.json(results);
    } catch (error) {
        console.error('Error fetching component details:', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
};

const getOrderAvailabilityStatus = async (req, res) => {
    try {
        const query = `
            SELECT
                oc.order_config_id AS "Order_ID",
                p.product_name AS "Product_Name",
                oc.order_quantity AS "Order_Quantity",
                oc.status AS "Status",
                oc.is_priority AS "Is_Priority",
                fs.available_quantity AS "Available_Quantity"
            FROM 
                order_config oc
            JOIN 
                products p ON oc.product_id = p.product_id
            LEFT JOIN 
                finished_store fs ON oc.product_id = fs.product_id
            ORDER BY 
                oc.is_priority DESC, oc.order_config_id ASC
        `;

        const results = await sequelize.query(query, {
            type: sequelize.QueryTypes.SELECT
        });

        res.json(results);
    } catch (error) {
        console.error('Error fetching order status:', error);
        res.status(500).json({ message: 'Error fetching data' });
    }
};
                                      
module.exports = { getPurchaseMaterials, getComponentWithSubComponents, getPurchaseRequirements, getOrderRequirements, getComponentDetails, getAllComponentDetails, getOrderAvailabilityStatus };