import express from 'express'

import { ProductController } from '../controllers/products-controller.js'

//Creo mi router.
export const router = express.Router()
//Creo la instancia.

const productController = new ProductController()


router.get('/api/products',productController.getProductsListPaginate)//Deveulve paginado
router.get('/api/products/:pid',productController.getProductById)//Devuelve listado entero
router.post('/api/products',productController.addProduct)
router.put('/api/products/:pid',productController.updateProduct)
router.delete('/api/products/:pid',productController.deleteProduct)
router.post('/api/products/addProductFromRealTimeProductsView', productController.addProductFromRealTimeProductsView)
router.get('/api/products/:id/changestatus',productController.changeProductStatus)

