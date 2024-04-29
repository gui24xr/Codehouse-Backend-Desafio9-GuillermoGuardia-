import { configSessionFileStorage } from "../config/sessions-config.js"
import { ProductModel } from "../models/product.model.js"


export class MongoProductsDAO{
   
    async getProducts(){
        try {
            const products = await ProductModel.find()
            return products
        } catch (error) {
            throw new Error('Error al obtener productos...')
        }
   }

   async getProductById(productId){
         try {
            const searchedProduct = await ProductModel.findById(productId)
            if (!searchedProduct) return null
            return searchedProduct._doc
        } catch (error) {
            throw new Error('Error al intentar obtener producto...')
        }

   }

   //Solamente modifica el stock...
   async updateProductStock(productId,newStockQuantity){
    
    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(
            productId,
            { $set: { stock: newStockQuantity } }, 
            { new: true }
        );
        if (!updatedProduct) {
            console.log('Producto no encontrado...');
            return {isSuccess: false,
                    message: `No existe producto con id${productId}.`
                }
        }
        return {
            isSuccess: true,
            message: `Se edito el producto con id${productId}.`,
            updatedProduct
        }
    } catch (error) {
        throw new Error('Error al intentar actualizar  stock producto...')
    }
   }


   async updateProduct(productId,newProduct){
    try {
        const updatedProduct = await ProductModel.findByIdAndUpdate(productId, newProduct, { new: true });
        if (!updatedProduct) {
            console.log('Producto no encontrado...');
            return {isSuccess: false,
                    message: `No existe producto con id${productId}.`
                }
        }
        return {
            isSuccess: true,
            message: `Se edito el producto con id${productId}.`,
            updatedProduct
        }
    } catch (error) {
        throw new Error('Error al intentar actualizar producto...')
    }
   }

   async deleteProduct(productId){
     try {
        const deletedProduct = await ProductModel.findByIdAndDelete(productId) 
        if (!deletedProduct){
            console.log('Producto no encontrado...');
            return {
                isSuccess: false,
                message: `No existe producto con id${productId}.`
            }
        }
        return {
            isSuccess: true,
            message: `Se elimino producto con id${productId}.`
        }
        }  catch (error) {
        throw new Error('Error al intentar eliminar producto...')
    }
   }

   async getProductsPaginate(limit,page,sort,query){
    try {
      //sort puede ser 1,-1 o undefined
      const sortBy = sort == 1 ? {price:1} : sort == -1 ? {price:-1} : {}
      const filterBy = query ? query : {} //Provisorio hasta que se implemente el filtro visual
      const products = await ProductModel.paginate(filterBy,{limit:limit,page:page, sort:sortBy})
      return products

    } catch (error) {
      console.log('Error al recuperar los productos...')
      throw error
    }
  }

      //Esta funcion agrega el producto y retorna el producto recien agregado. Retorna un objeto asi:
    //{success: true/false, message: '',product: producto Agregado}
    //Si producto no fue agregado devuelve null
    async addProduct({title, description,price,img,code,category,stock,status,thumbnails}){
        //console.log('En DAO: ', title, description,price,img,code,category,stock,status,thumbnails)
        try{
            //Comprobamos que vengan todos los campos en los parametros
            if (!title || !description || !price|| !img || !code ||  !category || !stock || !status|| !thumbnails){
                console.log('Es necesario ingresar todos los campos...')
                return {success: false, message: 'Es necesario ingresar todos los campos...',product: null}
            }
            //Busco que el producto no exista.
            //console.log('Existe code: ', code)
            const existProduct = await ProductModel.findOne({code:code})
            //console.log('Existe: ', existProduct)
            if (existProduct){
                //Si el codigo existe no agrego entonces salgo de la funcion enviando un mensaje a quien invoco
                console.log('Existe un producto con este codigo...')
                return {
                    success: false, 
                    message:  `El producto no fue agregado. Ya existe un producto con codigo ${code}`,
                    product: null
                }
            }
            //Si no existe procedemos a agregarlo.
            const nuevoProducto = new ProductModel({title, description,price,img,code,category,stock,status,thumbnails})
            nuevoProducto.save()
            //guarde el producto en la base de Datos ahora mando msg de OK
            return {
                success: true, 
                message:`Se guardo en la BD el producto enviado bajo el id ${nuevoProducto.id}`,
                product:nuevoProducto._doc
            }
        }catch(error){
            res.status(500)
        }
    }
    
    async changeProductStatus(productId){
        try{
            const searchedProduct = await ProductModel.findById(productId)
            if (!searchedProduct) {
                console.log('Producto no encontrado...');
                return {success: false,
                        message: `No existe producto con id${productId}.`
                        }
            }
            if ( searchedProduct.status == true ) searchedProduct.status = false
            else searchedProduct.status = true
            //searchedProduct.marks('products')
            searchedProduct.save()
            return {
                success: true,
                message: `Se cambio el estado del producto con id${productId}.`,
                searchedProduct
            }
        }catch(error){
            throw new Error(`Error al intentar cambiar estado a producto ${productId} desde mongoDao...`)
        }
    }



}