import { TicketModel } from "../models/ticket.model.js";

export class TicketsRepositories{

    //Si no hay consulta devuelve todos los tickets.
    async getTickets(filter){
        try {
            const ticketsList = await TicketModel.find(filter) 
            if (!ticketsList) return {success: true, message: 'No existen tickets para esta busqueda'}
            else return {success: true, message: 'Tickets obtenidos correctamente...', tickets:ticketsList}
        } catch (error) {
            throw new Error('Error al intentar obtener tickets desde ticketRepositories...')
        }
    }

    async getTicketsByPurchaser(purchaserId){
        try {
            const ticketsList = await TicketModel.find({purchaser:purchaserId}) 
            if (!ticketsList) return {success: false, message: `No existen tickets para purchaser ${purchaserId}`}
            else return {success: true, message: `Tickets para purchaser ${purchaserId} obtenidos correctamente...`, tickets:ticketsList}
        } catch (error) {
            throw new Error('Error al intentar obtener tickets desde ticketRepositories...')
        }
    }



    async createTicket(purchaserId,detailsList){
        try {
            //Con el detailList calculo el price y los subamount
            //console.log('LLegaron a crearticket los datos: ', purchaserId,detailsList)
            const detailListWithSubtotal = detailsList.map(item => (
                {...item,subTotalPrice: item.unitPrice * item.requiredQuantity}
            ))

            //console.log('Listsa detlla: ',detailListWithSubtotal)

            let totalAmount = 0
            detailListWithSubtotal.forEach(item => {
                totalAmount = totalAmount + item.subTotalPrice
                //console.log('acum: ', totalAmount)
            
            })
            //console.log('TOTAL: ', totalAmount)

            const generatedTicket = new TicketModel({purchaser:purchaserId,price:totalAmount.toFixed(2),details:detailListWithSubtotal})
            await generatedTicket.save()
            return generatedTicket
           
        } catch (error) {
            throw new Error('Error al intentar crear tickets desde ticketRepositories...')
        }
    }
    
}