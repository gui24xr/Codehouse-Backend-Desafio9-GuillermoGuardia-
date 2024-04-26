import { CartRepository } from "../repositories/cart.repositories.js"
import { ProductRepository } from "../repositories/products.repositories.js"
const cartRepository = new CartRepository()
const productRepository = new ProductRepository()

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
            const listToTicket = [] //LO que ira al ticket,
            const listNoTicket = [] //Lo que no ira al ticket...
           // console.log(await productRepository.getProductStockById('6627bee234fb32d5a0bc2d3b'))
            //Voy a buscar el carrito con el servicio de carritos
            const cart = await cartRepository.getCartById(cartId)
            console.log('Productos en el carro: ',cart)
            //Recorro cart.products y consulto stock y divido caminos.
           for(let item in cart.products){
                const productId = cart.products[item].product.toString()
                const requiredQuantity = cart.products[item].quantity
                console.log('Products Id en este cart: ',productId, ' Quantity: ', requiredQuantity)
                //corroboro stock del producto.
                const product = await productRepository.getProductById(productId)

                if (requiredQuantity <= product.stock){
                    console.log('Restamos stock...')
                    //Resto del stock
                    await productRepository.updateProductStock(productId,product.stock - requiredQuantity)
                    //Agrego al proceso de compra
                    listToTicket.push({
                        productId: product.id,
                        productTitle: product.title,
                        img: product.img,
                        unitPrice: product.price,
                        totalPrice: product.price * requiredQuantity,
                        })
                    //agrego data para generar el ticket
                    //borro del carro del usuario
                    await productRepository.deleteProduct(productId)
                }
                else{
                    console.log('No agregamos a la compra, no restamos del stock...')
                    //Junto en el array la lista de productos que no hay stock
                    listNoTicket.push({
                        productId: product.id,
                        productTitle: product.title,
                    })
                }
                //console.log('Stock Producto: ', product.stock)

                              
                
            }
            
          

            res.json({purchasedProducts: listToTicket, noPurchased: listNoTicket })
        }catch(error){
            throw new Error('Error al intentar checkout...')
        }
    }

}