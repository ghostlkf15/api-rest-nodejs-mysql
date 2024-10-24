import fetch from 'node-fetch';

const url = 'http://localhost:3000/api/clientes/1';
const data = {
  nombre: 'Nuevo Nombre'
};

fetch(url, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(data)
})
.then(response => response.json())
.then(data => console.log('Respuesta:', data))
.catch(error => console.error('Error:', error));
