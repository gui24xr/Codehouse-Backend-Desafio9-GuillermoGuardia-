import { ProductRepository } from "../repositories/products.repositories.js";

const productRepository = new ProductRepository()

export class ProductController{
    async getProducts(req,res){
        const limit = req.query.limit
        try{
            const productsList = await productRepository.getProducts()    
            limit 
            ? res.json(productsList.slice(0,limit))
            : res.json(productsList)
        }catch(error){
            res.status(500).send(`Error al obtener productos...`)
        }
    }

    async getProductById(req,res){
        const {pid:productId} = req.params
        try{
            const searchedProduct = await productRepository.getProductById(productId)
            //console.log(searchedProduct)
            !searchedProduct
            ? res.send('Producto no encontrado!')
            : res.json(searchedProduct)
           
        }catch(error){
            res.status(500).send(`Error al intentar obtener producto...`)
        }
    }

    async deleteProduct(req, res){
        const {pid:productIdToDelete} = req.params
           try{
             const deleteResult = await productRepository.deleteProduct(productIdToDelete)
            console.log('uu: ', deleteResult)
            !deleteResult.isSuccess 
            ? res.send('No existe el producto con este id...')
            : res.json(deleteResult)
      
        } catch(error){
            res.status(500).send(`Error al intentar eliminar producto...`)
        }
    }

    async updateProduct(req,res){
        const {pid:productIdToUpdate} = req.params
        const itemsToUpdateObject = req.body  //console.log(req.params,req.body)
        try{
            const updateResult = await productRepository.updateProduct(productIdToUpdate,itemsToUpdateObject)
            !updateResult.isSuccess 
            ? res.send('No existe el producto con este id...')
            : res.json(updateResult)
            
        }catch(error){
            res.status(500).send(`Error al intentar editar producto...`)
        }
    }

    async addProduct(req,res){
        const productToAdd =req.body
        console.log('prrr: ', productToAdd)
        try{
            const addResult = await productRepository.addProduct(productToAdd)
            !addResult.isSuccess 
            ? res.json(addResult)
            : res.json(addResult)

        }catch(error){
            res.status(500).send(`Error al intentar agregar producto...`)
        }
    }

       
async getProductsListPaginate(req,res){
    const {limit,page,sort,query} = req.query     
    try{
         const sortValue = sort == '1' ? 1 : sort == '-1' ? -1 : 0   //console.log('SortValue', sortValue)
        const paginate = await productRepository.getProductsPaginate(limit ? limit : 10,page ? page : 1,sortValue,query)
        res.json(paginate)

    }catch(error){
         res.status(500).json({error: 'Error del servidor'})
        throw new Error('Error al intentar obtener productos con paginacion...')
    }
}
}