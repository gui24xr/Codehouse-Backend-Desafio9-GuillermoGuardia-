import { UsersRepository } from "../repositories/users.repositories.js";
import {createHash, isValidPassword} from "../utils/hashbcryp.js"
import { generateJWT } from "../utils/jwt.js";

const usersRepository = new UsersRepository()

export class UsersController{
    
    async createUser(req,res){
        const {first_name, last_name, email, password,age, role} = req.body;
        console.log(req.body)
        try {
            //Armo tanto los datos como el carro que le asignare
            const createdUser = await usersRepository.createUser({
                first_name : first_name,
                last_name : last_name,
                email: email,
                password: createHash(password),
                age: age,
                role: role
            })
            if (createdUser.isSuccess) res.status(200).json(createdUser)
            else res.status(500).json(createdUser)
            
        }
        catch(error){
            throw new Error('Error al intentar crear usuario...')
        }
    }

    async authenticateUser(req,res){
        const {email,password} = req.body 
        console.log(req.body) 
        try {
            const authenticateResult = await usersRepository.authenticateUser(email,password)
            if (authenticateResult.isSuccess){
                //Salio Ok entonces envio token con la informacion del usuario
                //const token = jwt.sign({user: {...authenticateResult.user}},'coderhouse',{expiresIn:"1h"})
                res.cookie("sessiontoken", generateJWT(authenticateResult.user), {maxAge: 3600000,  httpOnly: true  })
               //res.redirect('/products') //Envio a la raiz y va a aparecer logueado y la barra de sesion con su info gracias a la lectura del token y el middleware
                res.json(authenticateResult)
             }
            else{
                res.json(authenticateResult)
            }
        } catch (error) {
            throw new Error('Error al intentar logear usuario...')
        }
       
    }

    async clearTokenSession(req,res){
      
        //Redirecciona home
        res.redirect('/')

    }

    

    
}