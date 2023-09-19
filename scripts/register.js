document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Obtén los datos del formulario como un objeto JSON
        const formData = {
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            email: document.getElementById('email').value,
            fecha_nacimiento: document.getElementById('fecha_nacimiento').value,
            avatar: document.getElementById('avatar').value, // Asumiendo que esta es la dirección de la imagen
            contraseña: document.getElementById('contraseña').value,
            //confirmarContrasena: document.getElementById('confirmar-contraseña').value,
            // Agrega otros campos de formulario aquí
        };

        try {
            // Formatea la fecha como "YYYY-MM-DD"
            const fechaNacimientoInput = document.getElementById('fecha_nacimiento');
            const fechaNacimiento = new Date(fechaNacimientoInput.value);
            formData.fecha_nacimiento = fechaNacimiento.toISOString().split('T')[0];

            const response = await fetch('http://127.0.0.1:5000/usuarios/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Especifica que estás enviando JSON
                },
                body: JSON.stringify(formData), // Convierte el objeto a JSON
            });

            if (response.ok) {
                // El registro fue exitoso, puedes redirigir al usuario a la página de inicio de sesión
                window.location.href = 'login.html';
            } else {
                const data = await response.json();
                // Muestra un mensaje de error al usuario, por ejemplo, en un elemento HTML
                // con id "error-message".
                document.getElementById('error-message').textContent = data.error;
            }
        } catch (error) {
            console.error('Error al registrar al usuario:', error);
        }
    });
});

// Obtén el elemento select y la imagen de vista previa
const avatarSelect = document.getElementById('avatar');
const avatarPreview = document.getElementById('avatar-preview');

// Agrega un evento change al elemento select
avatarSelect.addEventListener('change', () => {
    // Obtén la opción seleccionada
    const selectedOption = avatarSelect.options[avatarSelect.selectedIndex];
    
    // Obtén la URL de la imagen del atributo "data-image" de la opción seleccionada
    const imageUrl = selectedOption.getAttribute('data-image');
    
    // Actualiza la fuente de la imagen de vista previa con la URL seleccionada
    avatarPreview.src = imageUrl;
    
    // Muestra la imagen de vista previa (puedes ocultarla inicialmente con CSS si es necesario)
    avatarPreview.style.display = 'block';
});