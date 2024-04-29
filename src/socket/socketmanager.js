
import {Server} from 'socket.io'


import { MessagesRepository } from "../repositories/messages.repositories.js"
import { ProductRepository } from "../repositories/products.repositories.js"

const messagesRepository = new MessagesRepository()
const productRepository = new ProductRepository()

export class SocketManager{

    constructor(httpServer){
        this.io = new Server(httpServer)
        //this.initSocketEvents()
    }

    initSocketEvents(){
        this.io.on("connection",async(socket)=>{
            console.log("Un cliente se conectó!!!")

            /*-- Relacionado al chat -----------------------------*/
            //Cuando el cliente envie el mensaje escucha y lo guarda a la BD
            socket.on('eventAddMessage',async(receivedData)=>{
                //Toma lo recibido para guardarlo en La BD
                //console.log(receivedData)
                const  {user,message} = receivedData 
                await messagesRepository.saveMessages(user,message)

                //Una vez guardado el mensaje emite un evento devolviendo la lista de mensajes.
                //Devuelve la lista de mensajes del usuario con quien chatea, no todo !
                //Lo devuelve a travez del evento llamado eventMessages
                //console.log(await messagesRepository.getMessages())
                socket.emit('eventMessages', await messagesRepository.getMessagesFromUser(user))

            })


              /*-- Relacionado al realtimeproducts -----------------------------*/
              socket.emit('eventProducts',await productRepository.getProducts())
        

        })
    }

    async emitAddProduct(){
        this.io.emit('eventProducts',await productRepository.getProducts())
    }
}