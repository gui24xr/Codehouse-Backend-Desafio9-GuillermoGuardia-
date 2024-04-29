
import { MOTO_PRODUCTS } from './arraymotoproducts.js';
import fs from 'fs'



export const generarValorAleatorio = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

  
export function generarCodigo() {
    let codigo = "";
    const letras = "abcdefghijklmnopqrstuvwxyz";
    const numeros = "0123456789";
  
    // Generar 4 letras aleatorias
    for (let i = 0; i < 4; i++) {
      const letraAleatoria = letras.charAt(Math.floor(Math.random() * letras.length));
      codigo += letraAleatoria;
    }
  
    // Generar 4 números aleatorios
    for (let i = 0; i < 4; i++) {
      const numeroAleatorio = numeros.charAt(Math.floor(Math.random() * numeros.length));
      codigo += numeroAleatorio;
    }
  

    return codigo
  }





const convertirPrecio = (cadena) => {
  // Eliminar el signo "$" y cualquier carácter que no sea un dígito o un punto decimal
  let precioSinSigno = cadena.replace(/[^\d.]/g, '');
    // Convertir la cadena a un número decimal
  //let precioDecimal = parseFloat(precioSinSigno);
  return precioSinSigno
}

// Genero a partir de los datos otro esquema de datos...
const nuevosDatos = []
MOTO_PRODUCTS.forEach(item => {

  const stockQuantity = generarValorAleatorio(1,1500)

  nuevosDatos.push({
    title: item.productName,
    description: item.description,
    price: Number(convertirPrecio(item.productPrice)),
    img: item.imageSrc,
    code: generarCodigo(),
    category: item.category,
    stock:stockQuantity,
    status:stockQuantity >= 1 ? true : false,
    thumbnails: [item.imageSrc,item.imageSrc,item.imageSrc,item.imageSrc]
})


})

//Ahora paso y transformo todos los que tienen stock <1 les pongo status false


fs.promises.writeFile('motoproducts.json',JSON.stringify(nuevosDatos,null,1))
