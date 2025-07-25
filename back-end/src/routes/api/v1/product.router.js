const express = require('express');
const router = express.Router();
const { ProductController } = require('../../../controllers/index');
const { uploadFileMiddleware } = require('../../../middlewares/index');
const AuthMiddleware = require('../../../middlewares/auth.middleware');

router.delete('/soft-delete/:id', AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['sales manager']), ProductController.softDeleteProduct);
router.put('/update/:id', AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['sales manager']), uploadFileMiddleware.array('images', 10), ProductController.updateProduct);
router.get('/get-deleted-products', AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['sales manager']), ProductController.getAllDeletedProducts);
router.post('/', AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['sales manager']), uploadFileMiddleware.array('images', 10), ProductController.addProduct);
router.get('/get-image/:filename', ProductController.getImage);
router.get('/get-paginated-products', AuthMiddleware.verifyToken, AuthMiddleware.verifyRole(['sales manager']), ProductController.getPaginatedProducts);
router.get('/:productId', ProductController.getProductById);
router.get('/products/search', ProductController.searchProducts);
router.get('/price/desc', ProductController.getProductsSortedByPriceDescending);
router.get('/price/asc', ProductController.getProductsSortedByPriceAscending);
router.get('/products/new-arrivals', ProductController.getNewArrivals);
router.get('/', ProductController.getAllProducts);
module.exports = router;