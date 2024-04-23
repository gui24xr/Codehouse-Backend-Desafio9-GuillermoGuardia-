import sqlite3 from 'sqlite3'

const dbPath = './src/data/products.sql.db';
const db = new sqlite3.Database(dbPath);


export class SQLProductsDAO{
    async getProducts(){
        const products = []
        db.all(`SELECT * FROM productos`,[],(err,rows)=>{
            //rows es un array
            rows.forEach(item => {
                //console.log(item)
                products.push({...item})
            })
          })
          console.log('etrete',products)
          return products
          
   }

   probando(){
        db.all(`SELECT * FROM productos`,[],(err,rows)=>{
            console.log(rows)
        })
   }
}

