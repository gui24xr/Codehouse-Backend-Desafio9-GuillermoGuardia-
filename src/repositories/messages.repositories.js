import { configSessionFileStorage } from "../config/sessions-config.js"
import { MessageModel } from "../models/message.model.js"

export class MessagesRepository{
    async getMessages(){
        try{
            const messagesList = await MessageModel.find()
            console.log('EEE: ', messagesList)
            if (!messagesList) return null
            return messagesList
        }catch(error){
            throw new Error('Error al intentar obtener mensajes...')
        }
    }

    async getMessagesFromUser(user){
        try{
            const messagesList = await MessageModel.find({user:user})
            if (!messagesList) return null
            return messagesList
        }catch(error){
            throw new Error('Error al intentar obtener mensajes filtrados...')
        }
    }

    async saveMessages(user,message){
        try{
            const newMessage = new MessageModel({user:user,message:message})
            newMessage.save()
            return newMessage
        }catch(error){
            throw new Error('Error al intentar guardar mensajes...')
        }
    }
}
