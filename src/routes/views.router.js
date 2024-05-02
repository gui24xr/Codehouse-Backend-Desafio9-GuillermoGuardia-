import express from 'express'
import { middlewareChat, middlewareRealTimeProducts } from '../middlewares/middlewares.js'

//Creo la instancia de router.
export const router = express.Router()
import { ViewsController } from '../controllers/views-controllers.js'

const viewsController = new ViewsController()

router.get('/',viewsController.viewHome)
router.get('/views/products', viewsController.viewProductsList)
router.get('/views/productslistpaginate', viewsController.viewProductsListPaginate)
router.get('/views/product/:pid', viewsController.viewProduct)
router.get('/views/realtimeproducts', middlewareRealTimeProducts,viewsController.viewRealTimeProducts)
router.get('/views/chat',middlewareChat,viewsController.viewChat)
router.get('/views/registrarse', viewsController.viewRegisterGet)
router.post('/views/registrarse', viewsController.viewRegisterPost)
router.get('/views/login', viewsController.viewLoginGet)
router.post('/views/login', viewsController.viewLoginPost)
router.get('/views/logout', viewsController.viewLogout)
router.get('/views/profile', viewsController.viewProfile)
router.get('/views/carts/:cid', viewsController.viewCart)
router.get('/views/:cid/purchase', viewsController.viewPurchase)




