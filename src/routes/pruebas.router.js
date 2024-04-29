import express from 'express'

import { MongoProductsDAO } from '../dao/mongo.products.dao.js'

const mongoProductsDAO = new MongoProductsDAO()


export const router = express.Router()

router.get('/prueba',async(req,res)=>{

    res.send('pruebas')
})

router.get('/changeproductstatus/:id',async(req,res)=>{
    const {id} = req.params

    try{
        const operationResult = await mongoProductsDAO.changeProductStatus(id)
        console.log('Operation result: ',operationResult)
        res.json(operationResult)
    }catch(error){
        console.log(error)
    }
})
