const Product = require('../models/product.model');
const fs = require('fs');

class ProductService {
    async getProductsSortedByPriceAscending() {
        return await Product.find().sort({ price: 1 }).populate('brand').populate('category');
    }

    async getProductsSortedByPriceDescending() {
        return await Product.find().sort({ price: -1 }).populate('brand').populate('category');
    }
    async searchProducts(query) {
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
            ]
        }).populate('brand').populate('category');
        return products;
    }

    getProductById = async (productId) => {
        const product = await Product.findById(productId)
            .populate('brand', 'name')
            .populate('category', 'name')
            .lean();
        const result = {
            ...product,
            brand: product.brand.name,
            category: product.category.name,
        };
        return result;
    }

    async getAllProducts() {
        try {
            const products = await Product.find().populate('brand').populate('category');
            return products;
        } catch (error) {
            throw new Error('Error fetching products: ' + error.message);
        }
    }

    getPaginatedProducts = async (page, pageSize, keywords, sortBy) => {
        const skip = (page - 1) * pageSize;
        let filter = {
            isDeleted: false
        };
        if (keywords) {
            const regex = new RegExp(keywords, 'i');
            filter.name = { $regex: regex };
        }
        let sort = {};
        switch (sortBy) {
            case 'name': {
                sort.name = 1;
                break;
            }
            case 'brand': {
                sort['brand.name'] = 1;
                break;
            }
            case "category": {
                sort['category.name'] = 1;
                break;
            }
            case "phoneNumber": {
                sort.phoneNumber = 1;
                break;
            }
            case "role": {
                sort.totalPrice = 1;
                break;
            }
            case "isVerified": {
                sort.isVerified = 1;
                break;
            }
            case "cost": {
                sort.cost = 1;
                break;
            }
            case "price": {
                sort.price = 1;
                break;
            }
        }
        const products = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(pageSize)
            .populate('brand')
            .populate('category')
            .lean();
        const totalProducts = await Product.countDocuments(filter);
        return {
            products,
            totalProducts,
            totalPages: Math.ceil(totalProducts / pageSize),
            currentPage: page,
        };
    }

    getAllDeletedProducts = async () => {
        const products = await Product.find({ isDeleted: true })
            .populate('brand', 'name')
            .populate('category', 'name')
            .lean()
        const productsDetail = products.map(product => ({
            ...product,
            brand: product?.brand.name,
            category: product?.category.name,
        }));
        return {
            products: productsDetail,
        };
    };

    addProduct = async (name, description, brand, category, specs, inStock, isAvailable, imageFiles) => {
        const images = [];
        if (imageFiles && imageFiles.length > 0) {
            imageFiles.forEach(file => {
                images.push({
                    filename: file.filename,
                    path: file.path,
                    mimetype: file.mimetype,
                    size: file.size
                });
            });
        }
        if (typeof specs === 'string') {
            specs = JSON.parse(specs);
        }
        if (typeof inStock === 'string') {
            inStock = JSON.parse(inStock);
        }
        const newProduct = new Product({
            name,
            description,
            brand,
            category,
            specs,
            inStock,
            isAvailable,
            images
        });
        return await newProduct.save();
    }

    updateProduct = async (productId, name, description, brand, category, specs, inStock, isAvailable, imageFiles) => {
    const currentProduct = await Product.findById(productId);
    let images = currentProduct.images || [];

    if (imageFiles && imageFiles.length > 0) {
        // Xóa ảnh cũ trên ổ đĩa
        images.forEach(image => {
            try {
                fs.unlink(image.path, () => {});
            } catch (error) {
                console.log(error)
            }
        });
        // Thêm ảnh mới
        images = imageFiles.map(file => ({
            filename: file.filename,
            path: file.path,
            mimetype: file.mimetype,
            size: file.size
        }));
    }
    if (typeof specs === 'string') {
        specs = JSON.parse(specs);
    }
    if (typeof inStock === 'string') {
        inStock = JSON.parse(inStock);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { name, description, brand, category, specs, inStock, isAvailable, images },
        { new: true }
    );
    return updatedProduct;
}

    softDeleteProduct = async (productId) => {
        return await Product.updateOne({ _id: productId }, { $set: { isDeleted: true } }, { new: true });
    }

    async getNewArrivals() {
        return await Product.find({ isDeleted: false })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('brand', 'name')
            .populate('category', 'name')
    }
}

module.exports = new ProductService;