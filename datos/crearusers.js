/*
cuando por algun motivo necesitamos borrar todos los usuarios y crearlos nuevamente ejecuto este script
construye los nuevos usuarios haciendo una solicitud con fetch asi de paso crea carritos para ellos
tiene que estar el server corriendo para que pueda escuchar la peticion
*/



//----------------------------------------------


const usuarios = [
   {first_name : 'Guillermo', last_name : 'Guardia', email: 'guillermoxr24@gmail.com', password: '123456',age: 38, role: 'admin'},
   {first_name : 'Profe', last_name : 'Coderhouse', email: 'adminCoder@coder.com', password: 'adminCod3r123',age: 30, role: 'admin'},
   {first_name : 'User 01', last_name : 'lastname1', email: 'email1@gmail.com', password: '123456',age: 12, role: 'user'},
   {first_name : 'User 02', last_name : 'lastname2', email: 'email2@gmail.com', password: '123456',age: 24, role: 'admin'},
   {first_name : 'User 03', last_name : 'lastname3', email: 'email3@gmail.com', password: '123456',age: 38, role: 'user'},
   {first_name : 'User 04', last_name : 'lastname4', email: 'email4@gmail.com', password: '123456',age: 52, role: 'admin'},
]

usuarios.forEach(item =>{
    
fetch('http://localhost:8080/api/sessions/registrarse',{
    method:'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(item)
   })

})





