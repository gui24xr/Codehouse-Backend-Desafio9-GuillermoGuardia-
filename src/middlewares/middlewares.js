import { CartRepository } from "../repositories/cart.repositories.js";
import { UsersRepository } from "../repositories/users.repositories.js";
const cartsRepository = new CartRepository()
const usersRepository = new UsersRepository()
import passport from "passport";


//Este middleware lo utilizare para enviar a handlebars siempre los datos de sesion
//Y no tener que enviarlos plantilla por plantilla

/*Este middleware se encargara de:

  Ya que trabajo con JWT tener en variables globales datos de usuario para alimentar plantillas
  Dado que mi app esta configurada para que los json web token tenga la siguiente info
  user, role

*/

async function addSessionData(req, res, next) {
  // Llamada a Passport para autenticar con la estrategia 'jwt'
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
      if (err) { return next(err); }
      if (!user) { 
        res.locals.sessionData  = {
          login: false
        }
        return next(); 
      }
      //console.log('user desde token:',user)

      //console.log('User de jwt: ', user)
      //De este modo sabre a que cart agregar productos con la sesion iniciada , o sea con jwt activo
      //console.log('Carrete: ',await cartsRepository.getCartById(user.user.cart))
      //Si hay user autenticado entonces genero la variable que alimenta la barra de cesion  y lo mando en cada solictud
      res.locals.sessionData  = {
        login: true,
        user: user.user, 
        admin: user.user.role == 'admin' ? true : false, //Para saber si se trata de un admin
        productsQuantityInUserCart : await cartsRepository.countProductsInCart(user.user.cart),
      }
      
        next();
  })(req, res, next)
}



async function middlewareChat(req,res,next){
  /*Toma el email ingresado y corrobora que no sea un admin
    si es admin impide el acceso. Si es user o alguein no registrado permite el chat.
    Tener en cuenta que se puede acceder a chat sin estar logueado.
  */
  const {email} = req.query //console.log('Ingreso el email: ', email)
  const emailRole = await usersRepository.getMailRole(email)// console.log('Role: ',emailRole)
  emailRole == 'admin' 
  ? res.render('messagepage',{message:`${email} es administrador, no puede ingresar al chat !!!`})
  : next()
}

async function middlewareRealTimeProducts(req,res,next){

  /*Toma el email ingresado y corrobora que sea un admin
    si no es admin impide el acceso. 
    Este apartado deberia estar una vez logueado el usuario pero por cuestiones practias de consigna lo puse afuera en la barra , luego se cambia de lugar
  */
  const {email} = req.query //console.log('Ingreso el email: ', email)
  const emailRole = await usersRepository.getMailRole(email)// console.log('Role: ',emailRole)
  emailRole == 'admin' 
  ? next()
  : res.render('messagepage',{message:`${email} NO ES administrador, no puede ezta permitido el ingreso a real time products !!!`})
}

export {addSessionData,middlewareChat, middlewareRealTimeProducts}




