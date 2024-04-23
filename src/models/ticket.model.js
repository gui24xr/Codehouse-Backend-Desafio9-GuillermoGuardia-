import mongoose from "mongoose"


const collectionName = 'tickets'

const ticketSchema = mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    purchase_datetime: {
        type: Date,
        required: true,
        default: Date.now // No se necesita () aquí, solo se referencia la función Date.now
    },
    price: { 
        type: Number,
        required: true
    },
    purchaser: {
        type: String,
        required: true,
        index: true,
        validate: {
            validator: (value) => {
              // Utiliza una expresión regular para validar el formato del email
              return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
            },
            message: props => `${props.value} no es un email válido`
        }
    }
});

export const TicketModel = new mongoose.model(collectionName,ticketSchema)