//routes.js
const productController = require('../controllers/product.controller');
const brandController = require('../controllers/brand.controller');
const chalk = require('chalk');

module.exports = (app, router) => {

                router.post('/api/products', productController.handleCreateProduct);
				router.post('/api/brands/', brandController.handleCreateBrand);
				router.put('/api/brands/:brandId', brandController.handleUpdateBrand);
				router.get('/api/brands/:brandId', brandController.handleSearchOneBrand);
				router.delete('/api/brands/:brandId', brandController.handleDeleteBrand);
				router.get('/api/brands/', brandController.handleSearchBrands);
}