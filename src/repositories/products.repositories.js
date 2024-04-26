
import { MongoProductsDAO } from "../dao/mongo.products.dao.js";


const mongoProductsDAO = new MongoProductsDAO()

export class ProductRepository{
   
    async getProducts(){
        try {
            const products = await mongoProductsDAO.getProducts()
            return products
        } catch (error) {
            throw new Error('Error al obtener productos...')
        }
   }



   async getProductById(productId){
         try {
            const searchedProduct = await mongoProductsDAO.getProductById(productId)
            return searchedProduct
        } catch (error) {
            throw new Error('Error al obtener producto...')
        }

   }

   async updateProductStock(productId,newStockQuantity){
     try{
        await mongoProductsDAO.updateProductStock(productId,newStockQuantity)
     } catch(error){
      throw new Error('Error al intentar actualizar  stock producto...')
     }
   }


   async updateProduct(productId,newProduct){
    try {
        const updatedProduct = await mongoProductsDAO.updateProduct(productId,newProduct)
        return updatedProduct
    } catch (error) {
        throw new Error('Error al intentar actualizar producto...')
    }
   }

   async deleteProduct(productId){
   try {
        const deletedResult = await mongoProductsDAO.deleteProduct(productId)
        return deletedResult
        }  catch (error) {
        throw new Error('Error al intentar eliminar producto...')
    }
   }

   async getProductsPaginate(limit,page,sort,query){
    try {
        const products = await mongoProductsDAO.getProductsPaginate(limit,page,sort,query)
        return products
    } catch (error) {
      console.log('Error al recuperar los productos...')
      throw error
    }
  }


    async addProduct({title, description,price,img,code,category,stock,status,thumbnails}){
        try{
           const addResult = await mongoProductsDAO.addProduct({title, description,price,img,code,category,stock,status,thumbnails})
           return addResult
        }catch(error){
            res.status(500)
        }
    }




}