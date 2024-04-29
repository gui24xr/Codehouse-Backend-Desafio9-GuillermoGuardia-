import express from 'express'
import { CartsController } from '../controllers/carts-controller.js'

//Creo mi instancia de objeto Router
export const router = express.Router()
const cartsController = new CartsController()

router.get('/api/carts/:cid', cartsController.getCartById)
router.post('/api/carts',cartsController.createCart)
router.post('/api/carts/:cid/products/:pid',cartsController.addProductInCart)
router.delete('/api/carts/:cid/products/:pid',cartsController.deleteProductInCart)
router.delete('/api/carts/:cid',cartsController.clearCart)
router.put('/api/carts/:cid',cartsController.addProductListInCart)

//purchaseRoutes.
router.post('/:cid/purchase', cartsController.cartCheckout)

