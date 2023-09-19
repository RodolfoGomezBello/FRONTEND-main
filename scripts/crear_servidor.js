document.addEventListener("DOMContentLoaded", function () {
    // Obtener el formulario y agregar un evento para manejar su envío
    const crearServidorForm = document.getElementById("crearServidorForm");
    crearServidorForm.addEventListener("submit", function (event) {
        event.preventDefault(); // Evitar el envío del formulario por defecto

        // Obtener el nombre del servidor y el icono seleccionado
        const nombreServidor = document.getElementById("nombreServidor").value;
        const iconoServidor = document.getElementById("iconoServidor").value;

        // Obtener el propietario_id (ID del usuario activo)
        getUserIdFromSession()
            .then((propietario_id) => {
                if (propietario_id !== null) {
                    // Crear un objeto para los datos del servidor
                    const nuevoServidor = {
                        nombre: nombreServidor,
                        propietario_id: propietario_id,
                        icono_serv: iconoServidor,
                    };

                    // Realizar una solicitud POST para crear el servidor
                    fetch("http://127.0.0.1:5000/usuarios/servers", {
                        method: "POST",
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(nuevoServidor)
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        // Verificar si el servidor se creó con éxito
                        if (data.message === "Servidor creado exitosamente") {
                            // Redirigir al usuario a la página de inicio
                            window.location.href = "home.html";
                        } else {
                            // Mostrar un mensaje de error en la página
                            const errorDiv = document.getElementById("error-message");
                            errorDiv.textContent = "Error al crear el servidor. Inténtelo de nuevo.";
                        }
                    })
                    .catch((error) => {
                        console.error("Error al crear el servidor:", error);
                        alert("Error al crear el servidor.");
                    });
                } else {
                    // Manejar el caso en que no se pueda obtener el propietario_id
                    alert("No se pudo obtener el ID del usuario activo.");
                }
            });
    });

    // Función para obtener el propietario_id (ID del usuario activo)
    async function getUserIdFromSession() {
        try {
            // Realizar una solicitud GET para obtener los datos del usuario activo
            const response = await fetch('http://127.0.0.1:5000/usuarios/perfil', {
                method: 'GET',
                credentials: 'include', // Incluir las credenciales para mantener la sesión
            });

            if (response.ok) {
                const userData = await response.json();
                return userData.id; // Devolver el ID del usuario activo
            } else {
                console.error('Error al obtener los datos del usuario activo');
                return null; // Devolver null en caso de error
            }
        } catch (error) {
            console.error('Error al obtener el ID del usuario activo:', error);
            return null; // Devolver null en caso de error
        }
    }
});
