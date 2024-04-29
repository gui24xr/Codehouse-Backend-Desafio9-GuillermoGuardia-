  //Inicio escucha al server mediante websockets.
  const socket = io()

  //Capturo los elementos del dom que necesito manipular.
  const formMsg = document.getElementById('formMsg')
  const btnEnviar = document.getElementById('btnEnviar')
  
  
  //Evento para enviar mensajes. Cuando el form hace submit se emite por socket el evento 'eventAddMessage'
  formMsg.addEventListener('submit',(e)=>{
    e.preventDefault() //Evito el comportamiento predeterminado del form.
      const messageData = {
        user: document.getElementById("activeuser").innerText,
        message: document.getElementById("input-message").value
    }
    socket.emit('eventAddMessage',messageData)
  })
  
  
  //Escucho los mensajes, se que viene una lista la cual debo renderizar.
  socket.on('eventMessages',(messagesList)=>{
        messagesList.reverse() //Lo invertimos asi vemos el ultimo arriba de todo.
      //Al escuchar los mensajes que llegan del server...
      //borro la lista de mensajes actual del dom y renderizo todo nuevamente,
      const elementoPadre = document.getElementById('messages-list');
      while (elementoPadre.firstChild) elementoPadre.removeChild(elementoPadre.firstChild)
      messagesList.forEach(item => addMensajeToDom(item.user,item.message,item.createdAt))
  })



function addMensajeToDom(user,message,moment){
      // Crear elementos
      const liElement = document.createElement('li');
      liElement.className = 'flex flex-co border-b border-gray-100 dark:border-gray-600';

      const aElement = document.createElement('a');
      aElement.href = '#';
      aElement.className = 'flex items-start w-full px-8 py-3 hover:bg-gray-50 dark:hover:bg-gray-800';

      const imgElement = document.createElement('img');
      imgElement.className = 'me-3 rounded-full w-11 h-11';
      imgElement.src = '/avatar.png';
      
      const divElement = document.createElement('div');

      const pElement = document.createElement('p');
      pElement.className = 'text-sm text-gray-500 dark:text-gray-400';
      pElement.innerHTML = `<span class="font-medium text-gray-900 dark:text-white">${user}</span> dice: ${message}`;

      const spanElement = document.createElement('span');
      spanElement.className = 'text-xs text-blue-600 dark:text-blue-500';
      spanElement.textContent = `${moment}`

      // Construir la estructura
       divElement.appendChild(spanElement);
      divElement.appendChild(pElement);
     

      aElement.appendChild(imgElement);
      aElement.appendChild(divElement);

      liElement.appendChild(aElement);
      // Agregar el elemento al DOM (por ejemplo, al cuerpo del documento)
      document.getElementById('messages-list').appendChild(liElement)
}