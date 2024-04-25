import mongoose from "mongoose"


const collectionName = 'tickets'

const ticketSchema = mongoose.Schema({
    code: {
        type: String,
        unique:true,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
});

export const TicketModel = new mongoose.model(collectionName,ticketSchema)