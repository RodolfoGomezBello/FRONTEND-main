
document.getElementById('forgotPasswordForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;

    // Enviar una solicitud al servidor para recuperar la contraseña
    fetch('/recovery_password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Se ha enviado una nueva contraseña por correo electrónico.');
        } else {
            alert('No se pudo procesar la solicitud. Verifique su correo electrónico.');
        }
    })
    .catch(error => {
        console.error('Error al procesar la solicitud:', error);
        alert('Ha ocurrido un error al procesar la solicitud. Por favor, inténtelo de nuevo.');
    });
});
