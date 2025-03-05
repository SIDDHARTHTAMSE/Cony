const { Op } = require('sequelize');
const Categories = require('../models/category');
const Component = require('../models/component');
const Product = require('../models/products');
const FinishedProduct = require('../models/finishedProducts');
const SubComponent = require('../models/subComponents');

exports.searchItems = async (req, res, next) => {
    try{
        const { searchTerm } = req.body;

        if(!searchTerm){
            return res.status(400).json({ message: 'Search term is required'});
        }

        const component = await Component.findAll({
            where: {
                component_name: {
                    [Op.like]: `%${searchTerm}%`,
                },
            },
        });

        const products = await Product.findAll({
            where: {
                product_name: {
                    [Op.like]: `%${searchTerm}%`,
                },
            },
        });

        const categories = await Categories.findAll({
            where: {
                category_name: {
                    [Op.like]: `%${searchTerm}%`,
                },
            },
        });

        const finishedProducts = await FinishedProduct.findAll({
            include: [{ model: Product, where: { product_name: { [Op.like]: `%${searchTerm}%`} } }],
        });

        const subComponent = await SubComponent.findAll({ 
            where: {
                subcomponents_name: {
                    [Op.like]: `%${searchTerm}%`,
                },
            },
        });

        if(
            component.length === 0 &&
            products.length === 0 &&
            categories.length === 0 &&
            finishedProducts.length == 0 &&
            subComponent.length == 0
        ){
            return res.status(404).json({ message: `No results found for ${searchTerm}.`});
        }

        const results = {
            component,
            products,
            categories,
            finishedProducts,
            subComponent
        };

        return res.status(200).json(results);
    } catch (error){
        next(error);
    }
}
