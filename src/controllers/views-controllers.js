import { ProductRepository } from "../repositories/products.repositories.js"
const productRepository = new ProductRepository()

export class ViewsController{

    viewHome(req,res){
        res.render('home')
    }

    async viewProductsList(req,res){
        try{
            const productsList = await productRepository.getProducts()
            const mappedProducts = productsList.map(item => ({
                id: item.id, 
                title: item.title,
                description: item.description,
                price: item.price,
                img: item.img,
                code: item.code,
                category: item.category,
                stock: item.stock,
                status: item.status,
                thumbnails: item.thumbnails
            }))
            res.render('products',{productsList:mappedProducts})

        }catch(error){
            throw new Error('Error al intentar mostrar la vista productos...')
        }
    }

    async viewProduct(req,res){
        const {pid:productId} = req.params
        try{
            const product = await productRepository.getProductById(productId)
              //ya tengo el producto, ahora lo proceso para poder usarlo en handlebars
        const productDetail = {
            id: product._id, 
            title: product.title,
            description: product.description,
            price: product.price,
            img: product.img,
            code: product.code,
            category: product.category,
            stock: product.stock,
            status: product.status,
            thumbnails: product.thumbnails
        }

       res.render('productdetail', {productDetail: productDetail})
        }catch(error){
            throw new Error('Error al intentar mostrar vista producto...')
        }
    }


    viewRealTimeProducts(req,res){
        res.render("realTimeProducts")
    }

    viewChat(req,res){
        res.render('chat/chat')
   }


}