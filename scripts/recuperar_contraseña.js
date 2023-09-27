
// Función para enviar la solicitud POST al endpoint de recuperación de contraseña
function forgotPassword(event) {
    event.preventDefault(); // Evita que se envíe el formulario de forma tradicional
    
    const email = document.getElementById('email').value; // Obtén el valor del campo de correo electrónico
  
    // Crear un objeto de datos para enviar en la solicitud POST
    const data = {
      email: email
    };
  
    // Realizar la solicitud POST usando fetch
    fetch('http://127.0.0.1:5000/usuarios/forgot_password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('No se pudo enviar la nueva contraseña por correo electrónico');
      }
    })
    .then(data => {
     
      console.log(data.message);
      window.location.href = 'login.html';
    })
    .catch(error => {
      
      console.error(error.message);
    });
  }
  
  // Agregar un evento al formulario de recuperación de contraseña
  const forgotPasswordForm = document.getElementById('forgotPasswordForm');
  forgotPasswordForm.addEventListener('submit', forgotPassword);
  