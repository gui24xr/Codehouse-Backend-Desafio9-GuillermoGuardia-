import { CartRepository } from "../repositories/cart.repositories.js";
const cartsRepository = new CartRepository()
import passport from "passport";


//Este middleware lo utilizare para enviar a handlebars siempre los datos de sesion
//Y no tener que enviarlos plantilla por plantilla

/*Este middleware se encargara de:

  Ya que trabajo con JWT tener en variables globales datos de usuario para alimentar plantillas
  Dado que mi app esta configurada para que los json web token tenga la siguiente info
  user, role

*/

export async function addSessionData(req, res, next) {
  // Llamada a Passport para autenticar con la estrategia 'jwt'
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
      if (err) { return next(err); }
      if (!user) { 
        res.locals.sessionData  = {
          login: false
        }
        return next(); 
      }

      //console.log('User de jwt: ', user)
      //De este modo sabre a que cart agregar productos con la sesion iniciada , o sea con jwt activo

      //Si hay user autenticado entonces genero la variable que alimenta la barra de cesion  y lo mando en cada solictud
      res.locals.sessionData  = {
        login: true,
        user: user.user, 
        admin: user.role == 'admin' ? true : false, //Para saber si se trata de un admin
        productsQuantityInUserCart : await cartsRepository.countProductsInCart(user.cart)
      }//console.log('sessionInfo: ', res.locals.sessionData)
        next();
  })(req, res, next)
}



