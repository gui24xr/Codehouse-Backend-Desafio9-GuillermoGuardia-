import { ProductRepository } from "../repositories/products.repositories.js"
import { UsersRepository } from "../repositories/users.repositories.js"
import { generateJWT } from "../utils/jwt.js"
import { createHash } from "../utils/hashbcryp.js"
const productsRepository = new ProductRepository()
const usersRepository = new UsersRepository()

export class ViewsController{

    async viewHome(req,res){
        //Teniendo en cuenta que en res.locals.sessionData tenemos datos de si hay token activo y sus dato
        console.log('ssfs: ',res.locals.sessionData)

        if (res.locals.sessionData.login){
            res.redirect('/views/productslistpaginate')
        }
        else {
            try{
                const productsList = await productsRepository.getProducts()
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
                res.render('home',{productsList:mappedProducts})
    
            }catch(error){
                throw new Error('Error al intentar mostrar la vista productos...')
            }


            
        
        }
    }

    async viewProductsList(req,res){
        try{
            const productsList = await productsRepository.getProducts()
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

    
async viewProductsListPaginate(req,res){
    const {limit,page,sort,query} = req.query     
    //console.log('Parametros que llegaron', limit,page,sort,query)
    try{
        //Sort el formulario solo permitira que solo llegue -1,1 o 0
        //Por ahora dejo query para que entre por params
        //La idea es cuanto este implementado en el form armar la query para enviar al manager
        const sortValue = sort == '1' ? 1 : sort == '-1' ? -1 : 0   //console.log('SortValue', sortValue)
        const paginate = await productsRepository.getProductsPaginate(limit ? limit : 10,page ? page : 1,sortValue,query)
        //Hago un mapeo de docs para mandar a rendrizar en handlebars. 
        const mappedProducts = paginate.docs.map(item => ({
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

        //Valores que necesito para renderizar con handlebars.
       const valuesToRender = {
        productsList:mappedProducts,
        totalDocs : paginate.totalDocs,
        hasPrevPage : paginate.hasPrevPage ? 'SI' : 'No',
        hasNextage : paginate.hasNextPage ? 'SI' : 'No',
        prevPage: paginate.prevPage ? paginate.prevPage : '-',
        nextPage: paginate.nextPage ? paginate.nextPage : '-',
        actualPage: paginate.page,
        totalPages: paginate.totalPages,
        limit: paginate.limit,
        valuesToScript: JSON.stringify(paginate),
       }

       res.render('productspaginate',valuesToRender)

    }catch(error){
         res.status(500).json({error: 'Error del servidor'})
        throw new Error('Error al intentar obtener productos con paginacion...')
    }
}






    async viewProduct(req,res){
        const {pid:productId} = req.params
        try{
            const product = await productsRepository.getProductById(productId)
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

    
    async viewRegisterPost(req,res){
        const {first_name, last_name, email, password,age, role} = req.body;
       // console.log(req.body,'4545445454')
        try {
             const createdUser = await usersRepository.createUser({
                first_name : first_name,
                last_name : last_name,
                email: email,
                password: createHash(password),
                age: age,
                role: role
            })
        
            if (createdUser.isSuccess) res.render('messagepage',{message: createdUser.message})
            else res.status(500).render('messagepage',{message: createdUser.message})
            
        }
        catch(error){
            throw new Error('Error al intentar crear usuario...')
        }
    }



    viewLoginGet(req,res){
        res.render('login')
    }

    viewRegisterGet(req,res){
        res.render('register')
    }


    viewChat(req,res){
        res.render('chat/chat')
   }

   


}