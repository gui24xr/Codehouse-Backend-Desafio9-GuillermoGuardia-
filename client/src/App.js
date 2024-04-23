import logo from './logo.svg';
import './App.css';
import {useEffect} from 'react'

function App() {


  useEffect(()=>{

    /*
    fetch('/api/products/')
    .then(res => res.json())
    .then(json =>console.log(json))
    */

    fetch('/api/sessions/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'guillermoxr24@gmail.com',
        password: '123456'
      })
    })
    .then(response => response.json())
.then(data => {
  console.log('Respuesta del servidor:', data);
  // Aquí podrías manejar la respuesta del servidor, como almacenar el token en el cliente
})
.catch(error => {
  console.error('Error al enviar la solicitud:', error);
});
    
  },[])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
