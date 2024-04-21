import jwt from 'jsonwebtoken'

//Estas 2luego vendran de env
const SECRET_TOKENS_KEY = 'coderhouse'
const EXPIRES_TOKEN_TIME = "1h"
//Genera y devuelve un token con la data enviada por parametro
//Recibe un objeto
function generateJWT(userData){
    return jwt.sign({user: userData},SECRET_TOKENS_KEY,{expiresIn:EXPIRES_TOKEN_TIME})
}

export {generateJWT}