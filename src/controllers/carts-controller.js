import { CartRepository } from "../repositories/cart.repositories.js"
import { ProductRepository } from "../repositories/products.repositories.js"
import { CheckoutService } from "../services/checkout-service.js"
const cartRepository = new CartRepository()
const checkoutService = new CheckoutService()

export class CartsController{
    async getCartById(req,res){
        const {cid} = req.params
        try {
            //va ap obtener el cart y lo devolvera
            const cart = await cartRepository.getCartById(cid)
            if(!cart){
                console.log(`No existe carrito id${cid}`)
                res.send(`No existe carrito id${cid}`)
            }
           res.json(cart)
        } catch (error) {
           res.status(500).send(`Error al obtener carrito.`)
        }
    }

    async createCart(req,res){
        try {
            //va ap obtener el cart y lo devolvera
            const newCart = await cartRepository.createCart()
            res.json(newCart)
        } catch (error) {
           res.status(500).send(`Error al obtener carrito.`)
        }
    }

    async addProductInCart(req,res){
        const {cid:cartId,pid:productId} = req.params
        const {quantity} = req.body    //console.log(req.body)
        try {
            const cart = await cartRepository.addProductInCart(cartId,productId,quantity)
            //console.log('Desde repository: ',cart)
            if(!cart){
                console.log(`No existe carrito id${cid}`)
                res.send(`No existe carrito id${cid}`)
            }
            //En este caso ademas de devolver el cart enviare ya la info de cantidad de productos.
           res.json(cart)
        } catch (error) {
            res.status(500).send(`Error al agregar productos al carrito.`)
        }
    }

    async addProductListInCart(req,res){
        const {cid:cartId} = req.params
        const {productsArray} = req.body         //console.log('AA: ', productsArray)
        try {
            const modifiedCart = await cartRepository.addProductsListInCart(cartId,productsArray)
            if ( !modifiedCart.isSuccess ) {
                res.json(modifiedCart) 
            }
            else{
                res.json(modifiedCart)
            }
        } catch (error) {
            res.status(500).send(`Error al agregar lista de productos al carrito.`)
        }
    }


    async deleteProductInCart(req,res){
        const {cid,pid} = req.params // Obtengo los parametros.
    
        try {
            const deleteResult = await cartRepository.deleteProductInCart(cid,pid)
            if (deleteResult.isSuccess) res.json(deleteResult.cart)
            else{
                if (!deleteResult.cart) res.send('No existe el carrito...')
                else res.send('No existe un producto con dicho id en este carrito...')
            }
        }
        catch{
            console.log('Error al ingresar el producto carrito !.', error)
            res.status(500).json({error: 'Error del servidor'})
        }
    }


    async clearCart(req,res){
        const {cid} = req.params //Obtengo el id del carro a limpiar
        try{
            const clearResult = await cartRepository.clearCart(cid)
            if (!clearResult.isSuccess) res.send(`No existe carrito id${cid}`)
            else res.status(200).send(`Carrito id${cid} ah quedado vacio !!`)
        }  catch (error) {
           res.status(500).send(`Error al vaciar carrito.`)
        }
    }

    async cartCheckout(req,res){
        const {cid:cartId} = req.params
        try{
           const checkoutResult = await checkoutService.checkOutCart(cartId)
           res.status(200).json(checkoutResult)
        }catch(error){
            throw new Error('Error al intentar checkout desde controller carts...')
        }
    }

}