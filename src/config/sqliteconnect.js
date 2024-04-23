//Provisorio para conectar a sqlite luego se conectara desde database.js a eleccion
import sqlite3 from 'sqlite3'
const dbPath = 'mi_basedatos.db';

export function connectToSqlite3(){


    // Crea una instancia de la base de datos
    const db = new sqlite3.Database(dbPath);
}
