import { TicketModel } from "../models/ticket.model.js";

export class TicketsRepositories{

    async getTickets(){
        try {
            return 1
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