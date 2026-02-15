const Product = require('../models/product.model');

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin/Manager
const createProduct = async (req, res) => {
    try {
        const { name, price } = req.body;

        if (!name || !price) {
            return res.status(400).json({ message: 'Please add name and price' });
        }

        const product = await Product.create({
            name,
            price,
            createdBy: req.user.id
        });

        res.status(201).json({
            message: 'Product created successfully',
            product: {
                id: product._id,
                name: product.name,
                price: product.price,
                createdBy: product.createdBy
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.deleteOne();

        res.status(200).json({
            message: 'Product deleted successfully',
            product: {
                id: product._id,
                name: product.name,
                price: product.price,
                createdBy: product.createdBy
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createProduct,
    deleteProduct
};
