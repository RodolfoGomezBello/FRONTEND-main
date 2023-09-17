
document.addEventListener("DOMContentLoaded", function () {
    // Obtener los elementos donde mostraremos la información
    const nombreApellidoElement = document.getElementById("nombreApellido");
    const emailElement = document.getElementById("email");
    const servidoresDiv = document.getElementById("servidoresDiv");
    const canalesDiv = document.getElementById("canalesDiv");
    const mensajesDiv = document.getElementById("mensajesDiv");
    let elementoSeleccionado = null;

    // Obtener el botón "Cerrar"
    const logoutButton = document.getElementById("logout-button");

    // Función para cargar canales y mensajes de un servidor específico
    function cargarCanalesYMensajes(servidorId) {
        // Convertir el servidorId en un entero
        servidorId = parseInt(servidorId);

        // Realizar una solicitud para obtener los canales del servidor seleccionado
        fetch(`http://127.0.0.1:5000/usuarios/servers/${servidorId}/canales`, { method: "GET", credentials: 'include' })
            .then((response) => response.json())
            .then((data) => {
                // Mostrar los canales en canalesDiv
                const canalesHTML = data.map((canal) => {
                    return `<h2 class="canal" data-canalid="${canal.id_canal}">${canal.nombre}</h2>`;
                });
                canalesDiv.innerHTML = canalesHTML.join("");
            })
            .catch((error) => {
                console.error("Error al cargar canales:", error);
            });
    }

    // Event listener para hacer clic en un servidor
    servidoresDiv.addEventListener("click", function (event) {
        if (event.target.classList.contains("servidor")) {

             // Elimina la clase "selected" del elemento anteriormente seleccionado
            if (elementoSeleccionado) {
            elementoSeleccionado.classList.remove("selected");
            }

            const servidorId = event.target.getAttribute("data-servidorid");
            cargarCanalesYMensajes(servidorId);

            // Agrega la clase "selected" al servidor seleccionado
            event.target.classList.add("selected");
            elementoSeleccionado = event.target;
        }
    });

    // Event listener para hacer clic en un canal
    canalesDiv.addEventListener("click", function (event) {
        if (event.target.classList.contains("canal")) {
            // Elimina la clase "selected" del elemento anteriormente seleccionado
            if (elementoSeleccionado) {
                elementoSeleccionado.classList.remove("selected");
            }
    
            const canalId = event.target.getAttribute("data-canalid");
            const servidorId = servidoresDiv.getAttribute("data-servidorid");
            // Utiliza el canalId para cargar mensajes del canal seleccionado
            // Realizar una solicitud para obtener los mensajes del canal seleccionado
            fetch(`http://127.0.0.1:5000/usuarios/servers/${servidorId + 1}/canales/${canalId}/mensajes`, { method: "GET", credentials: 'include' })
                .then((response) => response.json())
                .then(async (data) => {
                    // Ordenar los mensajes por fecha y hora
                    data.sort((a, b) => new Date(a.fecha_envio) - new Date(b.fecha_envio));
    
                    // Obtener el email del usuario para cada mensaje
                    for (const mensaje of data) {
                        const usuarioId = mensaje.usuario_id;
                        try {
                            const response = await fetch(`http://127.0.0.1:5000/usuarios/${usuarioId}`, { method: "GET", credentials: 'include' });
                            if (response.ok) {
                                const usuarioData = await response.json();
                                mensaje.email_del_usuario = usuarioData.email;
                            } else {
                                console.error("Error al obtener el email del usuario");
                            }
                        } catch (error) {
                            console.error("Error al obtener el email del usuario:", error);
                        }
                    }
    
                    // Mostrar los mensajes en mensajesDiv
                    const mensajesHTML = data.map((mensaje) => {
                        const fecha = new Date(mensaje.fecha_envio); // Convierte la fecha a un objeto Date
                        const fechaFormateada = fecha.toLocaleString(); // Formatea la fecha y hora
                        return `<p><strong>Email del Usuario:</strong> ${mensaje.email_del_usuario} - <strong>Fecha:</strong> ${fechaFormateada} - <strong>Mensaje:</strong> ${mensaje.contenido}</p>`;
                    }).join("");
    
                    mensajesDiv.innerHTML = mensajesHTML;
                })
                .catch((error) => {
                    console.error("Error al cargar mensajes del canal:", error);
                });
    
            // Agrega la clase "selected" al canal seleccionado
            event.target.classList.add("selected");
            elementoSeleccionado = event.target;
        }
    });

    // Manejar el evento de clic en el botón "Cerrar"
    logoutButton.addEventListener("click", function () {
        // Realiza la solicitud al backend para cerrar la sesión
        fetch("http://127.0.0.1:5000/usuarios/logout", { method: "GET", credentials: 'include' })
            .then((response) => response.json())
            .then((data) => {
                // Verifica si el cierre de sesión fue exitoso en el backend
                if (data.message === "Sesión cerrada") {
                    // Redirige al usuario a la página index.html
                    window.location.href = "index.html";
                } else {
                    // Maneja el caso en el que el cierre de sesión falla
                    alert("Error al cerrar sesión");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Error al cerrar sesión");
            });
    });

    // Realizar una solicitud para obtener los datos del usuario
    fetch("http://127.0.0.1:5000/usuarios/perfil", { method: "GET", credentials: 'include' })
        .then((response) => response.json())
        .then((data) => {
            // Mostrar el nombre, apellido y email del usuario
            nombreApellidoElement.textContent = `${data.nombre} ${data.apellido}`;
            emailElement.textContent = data.email;
            
            // Realizar una solicitud para obtener los servidores del usuario
            return fetch("http://127.0.0.1:5000/usuarios/servers", { method: "GET", credentials: 'include' });
        })
        .then((response) => response.json())
        .then((data) => {
            // Mostrar los servidores en servidoresDiv
            const servidoresHTML = data.map((servidor, index) => {
                return `<h2 class="servidor" data-servidorid="${index + 1}">${servidor.nombre}</h2>`;
            });
            servidoresDiv.innerHTML = servidoresHTML.join("");
        })
        .catch((error) => {
            console.error("Error al cargar los datos:", error);
        });
});
