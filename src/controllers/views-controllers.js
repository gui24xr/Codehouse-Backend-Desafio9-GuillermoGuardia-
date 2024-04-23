import { ProductRepository } from "../repositories/products.repositories.js"
import { UsersRepository } from "../repositories/users.repositories.js"
import { generateJWT } from "../utils/jwt.js"
const productRepository = new ProductRepository()
const usersRepository = new UsersRepository()

export class ViewsController{

    viewHome(req,res){
        //Teniendo en cuenta que en res.locals.sessionData tenemos datos de si hay token activo y sus dato
        console.log('ssfs: ',res.locals.sessionData)

        if (res.locals.sessionData.login) res.redirect('/views/products')
        else res.render('home')
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

    viewLogout(req,res){
        //Diferente a logout de api
        //Este logou es para vistas, hace lo mismo pero ademas redirigje y acomdoda variables
          //Limpia de las cookies el token existente
          console.log('Entre por aca')
          //Busca el token que tiene el nombre de los token de nuestra app.
          res.clearCookie("sessiontoken");
          //Limpio mis variables de sesion 
          res.locals.sessionData.login = false
        res.redirect('/')
    }

    async viewLoginPost(req,res){
        //Hace lo mismo que api/login pero si esta todo Ok redirecciona a home
        //Si home detecta que hay un jwt valido entonces reenvia a products
        //No es necesario setear las variablesd e sesion xq de eso se encarga el middleware que fabriqu y leee JWT
        const {email,password} = req.body 
        console.log(req.body) 
        try {
            const authenticateResult = await usersRepository.authenticateUser(email,password)
            if (authenticateResult.isSuccess){
                //Salio Ok entonces envio token con la informacion del usuario
                //const token = jwt.sign({user: {...authenticateResult.user}},'coderhouse',{expiresIn:"1h"})
                res.cookie("sessiontoken", generateJWT(authenticateResult.user), {maxAge: 3600000,  httpOnly: true  })
               //res.redirect('/products') //Envio a la raiz y va a aparecer logueado y la barra de sesion con su info gracias a la lectura del token y el middleware
                res.redirect('/')
              
             }
            else{
                //Si no salio Ok el autenticado manda a pagina de errror
              //res.render('errorpage')
              console.log('etet')
            }
        } catch (error) {
            throw new Error('Error al intentar logear usuario...')
        }

    }

    viewLoginGet(req,res){
        res.render('login')
    }

    viewChat(req,res){
        res.render('chat/chat')
   }

   


}