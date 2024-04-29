
//Inicio la comunicacion mediante websockets.
const socket = io()

//------------------------------------------------------------------------
//--------------------------------------------------------------------------

//Recibo la lista de productos x socket y construyo la lista con el dom.
socket.on('eventProducts',(data)=>{
    //alert('escucuche eventProducts')
    console.log('Data eventProducts: ', data)

    let recentProducts = [...data] //Lo copio
    recentProducts.reverse()
    recentProducts = recentProducts.slice(0,8)

    //En la tabla recent meto los ultimos 8
    construirTabla(recentProducts,'rows-table-recent')
    //En la tabla all el catalogo entero
    construirTabla(data,'rows-table-allproducts')
 })


 


 function construirTabla(productsList,tableID){
  const rowsContainer = document.getElementById(tableID)


  //Antes de meter las filas limpio las tablas para que no se repita.
  const elementoPadre = document.getElementById(tableID);
  while (elementoPadre.firstChild) elementoPadre.removeChild(elementoPadre.firstChild)

    //Por cada elemento en data voy a construir una columna con esos datos
  productsList.forEach( item => {

      //Contruyo el contenedor fila
    const newRowContainer = document.createElement('tr')
    newRowContainer.className = "bg-white dark:bg-gray-800"
    //construyo las celdas
    const cellProductId = document.createElement('th')
    cellProductId.setAttribute("scope", "col");
    //cellProductId.className = "px-6 py-4"
    cellProductId.innerText = item._id

    const cellProductTitle = document.createElement('th')
    cellProductTitle.setAttribute("scope", "col");
    cellProductTitle.className = "px-2 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
    cellProductTitle.innerText = item.title

    const cellProductCode = document.createElement('th')
    cellProductCode.setAttribute("scope", "col");
    //cellProductStock.className = "px-6 py-4"
    cellProductCode.innerText = item.code

    const cellProductStock = document.createElement('th')
    cellProductStock.setAttribute("scope", "col");
    //cellProductStock.className = "px-6 py-4"
    cellProductStock.innerText = item.stock

    const cellProductCategory = document.createElement('th')
    cellProductCategory.setAttribute("scope", "col");
    //cellProductCategory.className = "px-6 py-4"
    cellProductCategory.innerText = item.category

    const cellProductPrice = document.createElement('th')
    cellProductPrice.setAttribute("scope", "col");
    //cellProductPrice.className = "px-6 py-4"
    cellProductPrice.innerText =  item.price

    const cellProductStatus = document.createElement('th')
    cellProductStatus.setAttribute("scope", "col");
    //De acuerdo al estado renderizo un ancor u otro para llamar a la solicitud http que llamara al server socket
    const linkButton = document.createElement('a')
    
    if (item.status == true){
      linkButton.href = `/api/products/${item._id}/changestatus`
      linkButton.innerText = 'Inactivar producto'
      linkButton.className = "inline-block bg-green-500 hover:bg-blue-700 text-white py-1 px-2 rounded"
    }else{
      linkButton.href = `/api/products/${item._id}/changestatus`
      linkButton.innerText = 'Activar producto'
      linkButton.className = "inline-block bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded"
    }
    cellProductStatus.appendChild(linkButton)
    

    //Los agrego a la tabla
    newRowContainer.appendChild(cellProductId)
    newRowContainer.appendChild(cellProductTitle)
    newRowContainer.appendChild(cellProductCode)
    newRowContainer.appendChild(cellProductStock)
    newRowContainer.appendChild(cellProductCategory)
    newRowContainer.appendChild(cellProductPrice)
    newRowContainer.appendChild(cellProductStatus)
    
    rowsContainer.appendChild(newRowContainer)
 
  })
  }


  function clearForm(){
     document.getElementById('formproducts').reset()
    m
  }
  