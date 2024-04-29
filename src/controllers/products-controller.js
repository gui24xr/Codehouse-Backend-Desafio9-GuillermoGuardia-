import { ProductRepository } from "../repositories/products.repositories.js";
import { mySocketServer } from "../app.js";

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

    async addProductFromRealTimeProductsView(req,res){
        //const productToAdd = req.body
        console.log('prrr: ', req.body)
        const {title,description,code,price,stock,category,status,img} = req.body
        try{
           const addProductResult = await productRepository.addProduct({
                title:title,
                description:description,
                price:price,
                img:img,
                code:code,
                category:category,
                stock:stock,
                status:status,
                thumbnails:'tt'})

        console.log(addProductResult)
        //Si todo salio OK hacemos el socket.emit, de lo contrario errorpage y mensaje.
        if (addProductResult.success){
            //console.log('socketEMit')
            mySocketServer.emitAddProduct()
            res.status(204).end();
        }
        else{
            res.render('messagepage',{message: addProductResult.message})
        }

        }catch(error){
            throw new Error(`Error al intentar agregar producto from realTimeView...`)
        }
     
    }

async changeProductStatus(req,res){
    //Se encarga de cambiar de activo/inactivo el estado del producto para que aparezca o no en la tienda.
    const {id:productId} = req.params
    console.log(`Cambiar estado a productID ${productId}`)
    try{
        const changeStatusResult = await productRepository.changeProductStatus(productId)
        if(changeStatusResult.success){
            //console.log('socketEMit')
            mySocketServer.emitAddProduct()
            res.status(204).end();
        }
        else{
            res.render('messagepage',{message: changeStatusResult.message})
        }
        
    }catch(error){
        throw new Error(`Error al intentar cambiar estado del producto id${productId}`)
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