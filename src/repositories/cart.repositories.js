import {CartModel} from '../models/cart.model.js'

export class CartRepository {

    async createCart(){
        try{
            const newCart = new CartModel({products:[]})
            await newCart.save()
            return newCart
        }catch(error){
            throw new Error('Error al crear carrito...')
        }
    }

 
    async getCartById(cartId){
        try {
            const searchedCart = await CartModel.findById(cartId)
            if(!searchedCart) {
                console.log(`No existe carrito id${cartId}`)
                return null
            }
            return searchedCart     
        } catch (error) {
            throw new Error('Error al obtener carrito por ID...')
        }
    }

    async getProductsInCart(cartId){
        try {
            const searchedCart = await CartModel.findById(cartId)
            if(!searchedCart) {
                console.log(`No existe carrito id${cartId}`)
                return null
            }
            return searchedCart.products    
        } catch (error) {
            throw new Error(`Error al obtener productos del carrito id${cartId}`)
        }
    }

    async addProductInCart(cartId,productId,quantity){
        try {
            //Busco el carrito y de acuerdo a exista o no el producto en el tomo un comportamiento u otro.
            const searchedCart = await CartModel.findById(cartId)
            //Si no exist el carrito salgo devolviendo null
            if(!searchedCart) {
                console.log(`No existe carrito id${cartId}`)
                return null
            }
            //Si el carrito existe veo si el producto esta o no esta.
            const existProductInCart = searchedCart.products.some(item => item.product._id == productId )
            if (!existProductInCart){
                if (quantity) searchedCart.products.push({product:productId,quantity:quantity})
                else searchedCart.products.push({product:productId,quantity:1})
            }
            else{
                const position = searchedCart.products.findIndex(item => item.product._id == productId  )
                //Si me pasaron cantidad por parametro pongo esa cantidad, si no, solo agrego uno.
                !quantity ? searchedCart.products[position].quantity +=1 :  searchedCart.products[position].quantity += quantity
            }
            searchedCart.markModified("carts")
            await searchedCart.save()
            return searchedCart //fijarse si obtener nuevamente antes de devolver.

        } catch (error) {
            throw new Error('Error al agregar producto al carrito...')
        }
    }

    async deleteProductInCart(cartId,productId){
        try {
            const searchedCart = await CartModel.findById(cartId)
            if (!searchedCart){
                console.log(`No existe carrito id${cartId}`)
                return {isSuccess:false,message: `No existe carrito id${cartId}`}
            }
            const existProductInCart = searchedCart.products.some(item => item.product.toString() == productId )
            if (existProductInCart){
                console.log('El producto esta en el carro, procedemos a eliminarlo...')
                const position = searchedCart.products.findIndex(item => item.product.toString() == productId )
                searchedCart.products.splice(position,1)
                searchedCart.markModified("carts")
                await searchedCart.save()
                return {isSuccess:true,message: 'Producto Eliminado correctamente', cart:searchedCart}
            }
            else{
               console.log(`El producto ${productId} no esta en el carro,no hay nada para eliminar !`)
               return { isSuccess: false, message: 'El producto no se encontró en el carrito',cart:searchedCart };
            } 
        } catch (error) {
            throw new Error('Error al eliminar producto del carrito...')
        }
    }

    async addProductsListInCart(cartId,productsList){
        try {
            //Busco el carrito y de acuerdo a exista o no el producto en el tomo un comportamiento u otro.
            const searchedCart = await CartModel.findById(cartId)
            //Si no exist el carrito salgo devolviendo null
            if(!searchedCart) {
                console.log(`No existe carrito id${cartId}`)
                return {isSuccess:false,message: `No existe carrito id${cartId}`}
            }
            //Si el carrito existe recorro el array y voy actualizando el array Products
             productsList.forEach( item => {
                const existProductInCart = searchedCart.products.some(productItem => productItem.product.toString() == item.productId )
                if (existProductInCart){
                    console.log('Existe el producto con ese ID actualizaremos su cantidad...')
                    const position = searchedCart.products.findIndex(productItem => productItem.product.toString() == item.productId )
                    //Si me pasaron cantidad por parametro pongo esa cantidad, si no, solo agrego uno.
                   searchedCart.products[position].quantity += item.quantity
                    }
                else{//Si el carro no tiene este producto le creo el item con la cantidad
                    searchedCart.products.push({product:item.productId,quantity:item.quantity})
                } 
            })
            //Actualice todo el array ahora guardo,Actualizo en la BD y retorno.
           searchedCart.markModified("carts")
           await searchedCart.save()
           return {isSuccess:true,message: 'La lista de productos se ingreso en el carrito OK !', cart:searchedCart}
        } catch (error) {
            throw new Error('Error al agregar producto al carrito...')
        }
    }

    async clearCart(cartId){
         try {
            //Busco el carrito y de acuerdo a exista o no el producto en el tomo un comportamiento u otro.
            const searchedCart = await CartModel.findById(cartId)
            //Si no exist el carrito salgo devolviendo null
                if(!searchedCart) {
                    console.log(`No existe carrito id${cartId}`)
                    return {isSuccess:false,message: `No existe carrito id${cartId}`}
                }
                
                searchedCart.products = [] //vacio el array y actualizo BD.
                searchedCart.markModified("carts") //Actualizo en la BD
                await searchedCart.save()
                return {isSuccess:true,message: 'El carrito ah sido vaciado !', cart:searchedCart}
           } catch (error) {
                throw new Error('Error al intentar vaciar el carrito...')
           }

    }

    async countProductsIncart(cartId){
        try {
               //Busco el carrito y de acuerdo a exista o no el producto en el tomo un comportamiento u otro.
               const searchedCart = await CartModel.findById(cartId)
               //Si no exist el carrito salgo devolviendo null
                if(!searchedCart) {
                    console.log(`No existe carrito id${cartId}`)
                    return null
                }
                let productsQuantity = 0
                searchedCart.cart.products.forEach( item => productsQuantity = productsQuantity + item.quantity)
                return productsQuantity

        } catch (error) {
            throw new Error(`Error al hacer el conteo de productos en el carrito id${cartId}`)
        }
    }
}