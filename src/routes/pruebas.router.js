import express from 'express'

import { MongoProductsDAO } from '../dao/mongo.products.dao.js'
import { CartRepository } from '../repositories/cart.repositories.js'
import { CheckoutService } from '../services/checkout-service.js'
import { UsersRepository } from '../repositories/users.repositories.js'
import { TicketsRepositories } from '../repositories/ticket.repositories.js'


const mongoProductsDAO = new MongoProductsDAO()
const cartsRepository = new CartRepository()
const checkoutService = new CheckoutService()
const userRepositories = new UsersRepository()
const ticketRepositories = new TicketsRepositories

export const router = express.Router()

router.get('/prueba',async(req,res)=>{

    res.send('pruebas')
})

router.get('/changeproductstatus/:id',async(req,res)=>{
    const {id} = req.params

    try{
        const operationResult = await mongoProductsDAO.changeProductStatus(id)
        console.log('Operation result: ',operationResult)
        res.json(operationResult)
    }catch(error){
        console.log(error)
    }
})

router.get('/cart/:cid',async (req,res)=>{
    const {cid:cartId} = req.params
    console.log(typeof(cartId))
    try{
       const productsInCart = await cartsRepository.getProductsInCart('662ff555872d32b9ed9f1935')
       console.log('Cart:', productsInCart )
      // Mapeo para entregar a hbds
        const productsList = productsInCart.map(item => ({
            id:item.product._id,
            img:item.product.img,
            title:item.product.title,
            price:item.product.price,
            quantity:item.quantity,
            totalAmount: Number(item.quantity) * Number(item.product.price)
        }))
        //console.log('Produclist: ',productsList)
        res.render('cart',{productsList:productsList})
    }

    catch(error){
        throw new Error('Error al intentar renderizar vista cart desde prubas...')   
    }
})

router.get('/checkout/:email',async(req,res)=>{
    try{
        const searchedUser = await userRepositories.getUser(req.params.email)
        if (!searchedUser){
            return 'No existe user...'
        }
      
        const checkoutResult = await checkoutService.checkOutCart(searchedUser.cart)
        res.json(checkoutResult)
    }catch(error){
        throw new Error(`Error al intentar checkout pruebas`)
    }

})

router.get('/searchusers',async(req,res)=>{

    //const {filter} = req.query
    //console.log('Filter en endpoint: ', filter)
    const filter={'cart':'663120ceda09d7ad646a3ff6'}
    try{
        const searchResult = await userRepositories.getUsers(filter)
        res.json(searchResult)
    }catch(error){
        throw new Error('Error en prueba searchusers...')
    }
    
})

router.get('/gettickets',async(req,res)=>{

    try{
        //const searchResult = await ticketRepositories.getTickets({purchaser:'663120ceda09d7ad646a4000'})
        const searchResult = await ticketRepositories.getTicketsByPurchaser('663120ceda09d7ad646a4000')
        //console.log(searchResult)
        res.json(searchResult)
    }catch(error){
        throw new Error('Error en prueba gettickets...')
    }
})