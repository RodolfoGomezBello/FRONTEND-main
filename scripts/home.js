let servidorSeleccionadoElement = null;
let canalSeleccionadoElement = null;
let id_servidorSeleccionado = null;
let id_canalSeleccionado = null;
let emailDelUsuario = '';
let usuarioEnServidor = false;
let servidorIds = [];
let userId=null
let userIDmensaje=null;
let mensajeSeleccionadoId = null;
let botonesDiv = null;
let mensajeIdSeleccionado = null;
let usuarioIdSeleccionado = null;
let mensajesTabla = {};
let Mensajote={};
let contenidoSeleccionado='';

document.addEventListener("DOMContentLoaded", function () {
    // Obtener los elementos donde mostraremos la información
    const nombreApellidoElement = document.getElementById("nombreApellido");
    const emailElement = document.getElementById("email");
    const servidoresDiv = document.getElementById("servidoresDiv");
    const canalesDiv = document.getElementById("canalesDiv");
    const mensajesDiv = document.getElementById("mensajesDiv");
    
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
            if (servidorSeleccionadoElement) {
                servidorSeleccionadoElement.classList.remove("selected");
            }

            // Almacena el elemento del servidor seleccionado
            servidorSeleccionadoElement = event.target;

            // Almacena el id del servidor seleccionado
            id_servidorSeleccionado = event.target.getAttribute("data-servidorid");

            // Carga los canales y mensajes del servidor seleccionado
            cargarCanalesYMensajes(id_servidorSeleccionado);

            // Agrega la clase "selected" al servidor seleccionado
            event.target.classList.add("selected");
        }
    });

    // Event listener para hacer clic en un canal
    canalesDiv.addEventListener("click", function (event) {
        if (event.target.classList.contains("canal")) {
            // Elimina la clase "selected" del elemento anteriormente seleccionado
            if (canalSeleccionadoElement) {
                canalSeleccionadoElement.classList.remove("selected");
            }

            canalSeleccionadoElement = event.target;
            id_canalSeleccionado= event.target.getAttribute("data-canalid");
            const canalId = event.target.getAttribute("data-canalid");

            // Utiliza el id_servidorSeleccionado para cargar mensajes del canal seleccionado
            if (id_servidorSeleccionado) {
                // Realizar una solicitud para obtener los mensajes del canal seleccionado
                fetch(`http://127.0.0.1:5000/usuarios/servers/${id_servidorSeleccionado}/canales/${canalId}/mensajes`, { method: "GET", credentials: 'include' })
                    .then((response) => response.json())
                    .then(async (data) => {
                        // Ordenar los mensajes por fecha y hora
                        data.sort((a, b) => new Date(a.fecha_envio) - new Date(b.fecha_envio));
                        // Actualizar mensajesTabla con los nuevos datos
                        data.forEach((mensaje) => {
                            mensajesTabla[mensaje.id_mensaje] = mensaje.usuario_id;
                            console.log(`Mensaje ID: ${mensaje.id_mensaje}, Usuario ID: ${mensaje.usuario_id}`);
                        });
                        // Obtener el email del usuario para cada mensaje
                        for (const mensaje of data) {
                            const usuarioId = mensaje.usuario_id;
                            // Agregar el mensaje y el usuario a la tabla
                            //mensajesTabla[mensaje.id] = usuarioId;
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
                            //return `<p><strong>Email del Usuario:</strong> ${mensaje.email_del_usuario} - <strong>Fecha:</strong> ${fechaFormateada} - <strong>Mensaje:</strong> ${mensaje.contenido}</p>`;
                            return `<p class="mensaje" data-id_mensaje="${mensaje.id_mensaje}"><strong>Email del Usuario:</strong> ${mensaje.email_del_usuario} - <strong>Fecha:</strong> ${fechaFormateada} - <strong>Mensaje:</strong> ${mensaje.contenido}</p>`;
                        }).join("");

                        mensajesDiv.innerHTML = mensajesHTML;
                    })
                    .catch((error) => {
                        console.error("Error al cargar mensajes del canal:", error);
                    });
            }

            // Agrega la clase "selected" al canal seleccionado
            event.target.classList.add("selected");
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
           // const nombreCapitalizado = data.nombre.charAt(0).toUpperCase() + dataFromBackend.nombre.slice(1);
            //const apellidoCapitalizado = data.apellido.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');  
            //const nombreCompleto = nombreCapitalizado + ' ' + apellidoCapitalizado;
            //nombreApellidoElement.textContent = nombreCompleto
            nombreApellidoElement.textContent = `${data.nombre.charAt(0).toUpperCase()+data.nombre.slice(1)} ${data.apellido.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`;
            emailDelUsuario =  data.email;
            emailElement.textContent = `${emailDelUsuario}`;
            userId = data.id;
            // Obtener la URL del avatar del usuario
            const avatarUrl = data.avatar; // Asegúrate de que este sea el nombre correcto en tus datos
            // Obtén la referencia al elemento de imagen del avatar y la leyenda del avatar
            const avatarImg = document.getElementById("avatarImg");
            const avatarText = document.getElementById("avatarText");
            // Actualizar el src de la imagen con la URL del avatar
            avatarImg.src = avatarUrl;
            // Verifica si la URL de la imagen del avatar está vacía
            if (avatarImg.src.trim() === "") {
               avatarText.textContent = "Elija un Avatar";
            } else {
               avatarText.textContent = ""; // Oculta la leyenda si hay una imagen de avatar
            }

            // Realizar una solicitud para obtener los servidores del usuario
            return fetch("http://127.0.0.1:5000/usuarios/servers", { method: "GET", credentials: 'include' });
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.length === 0) {
                // Mostrar el mensaje si el usuario no está en ningún servidor
                servidoresDiv.innerHTML = "<p>AUN NO SE HA UNIDO A NINGÚN SERVIDOR</p>";
            } else {
                // Mostrar los servidores en servidoresDiv
                const servidoresHTML = data.map((servidor, index) => {
                    return `<h2 class="servidor" data-servidorid="${index + 1}">${servidor.nombre}</h2>`;
                });
                servidoresDiv.innerHTML = servidoresHTML.join("");
            }
        })
        .catch((error) => {
            console.error("Error al cargar los datos:", error);
        });
});

// Obtener el botón "Enviar Mensaje"
const enviarMensajeButton = document.getElementById("enviarMensajeButton");

// Event listener para enviar un mensaje
enviarMensajeButton.addEventListener("click", function () {
    const mensajeInput = document.getElementById("mensajeInput");
    const mensajeContenido = mensajeInput.value.trim();

    if (mensajeContenido !== "") {
        // Verifica si hay un servidor seleccionado
        if (id_servidorSeleccionado !== null) {
            // Obtener el canal actualmente seleccionado
            const canalSeleccionado = canalSeleccionadoElement;

            if (canalSeleccionado) {
                // Si hay un canal seleccionado, obtener su id
                const canalId = canalSeleccionado.getAttribute("data-canalid");
                
                // Antes de enviar el mensaje, se obtiene el "Email del Usuario" localmente
                //const emailDelUsuario = emailElement.textContent;

                // Crear el objeto de mensaje
                const nuevoMensaje = {
                    contenido: mensajeContenido
                };

                // Realizar una solicitud POST para enviar el mensaje
                fetch(`http://127.0.0.1:5000/usuarios/servers/${id_servidorSeleccionado}/canales/${canalId}/mensajes`, {
                    method: "POST",
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(nuevoMensaje)
                })
                .then((response) => response.json())
                .then((data) => {
                    // Agregar el nuevo mensaje al div de mensajes
                    const fecha = new Date(data.fecha_envio);
                    const fechaFormateada = fecha.toLocaleString();
                    const nuevoMensajeHTML = `<p><strong>Email del Usuario:</strong> ${emailDelUsuario} - <strong>Fecha:</strong> ${fechaFormateada} - <strong>Mensaje:</strong> ${data.contenido}</p>`;
                    mensajesDiv.innerHTML += nuevoMensajeHTML;
                    
                    mensajeInput.value = ""; // Limpiar el campo de entrada
                })
                .catch((error) => {
                    console.error("Error al enviar el mensaje:", error);
                });
            } else {
                alert("Por favor, selecciona un canal antes de enviar un mensaje.");
            }
        } else {
            alert("Por favor, selecciona un servidor antes de enviar un mensaje.");
        }
    } else {
        alert("Por favor, escribe un mensaje antes de enviarlo.");
    }
});

//comienza aqui
// Agregar un evento click al contenedor de mensajes
mensajesDiv.addEventListener("click", function (event) {
    const mensajeSeleccionado = event.target.closest(".mensaje");
    console.log(mensajeSeleccionado);
    Mensajote = mensajeSeleccionado;

    if (mensajeSeleccionado) {
        const mensajeIdSeleccionado = parseInt(mensajeSeleccionado.getAttribute("data-id_mensaje"), 10);
        const usuarioIdSeleccionado = mensajesTabla[mensajeIdSeleccionado];
        const esPropietario = mensajeSeleccionado.getAttribute("data-propietario") === "true";
        console.log(mensajeIdSeleccionado);
        console.log(usuarioIdSeleccionado);
        console.log(esPropietario);
        // Eliminar los botones de edición y eliminación de todos los mensajes
        eliminarBotonesEdicionYEliminacion();

        // Crear botones de edición y eliminación solo para el mensaje seleccionado
        const botonesDiv = crearBotonesEdicionYEliminacion(mensajeIdSeleccionado, esPropietario);
        mensajeSeleccionado.appendChild(botonesDiv);
    }
});

// Función para eliminar los botones de edición y eliminación de todos los mensajes
function eliminarBotonesEdicionYEliminacion() {
    const mensajes = document.querySelectorAll(".mensaje");

    mensajes.forEach((mensaje) => {
        const botonesDiv = mensaje.querySelector(".mensaje-buttons");

        if (botonesDiv) {
            botonesDiv.remove();
        }
    });
}

// Función para crear botones de edición y eliminación de mensajes
function crearBotonesEdicionYEliminacion(mensajeId, esPropietario) {
    const editarButton = document.createElement("button");
    const eliminarButton = document.createElement("button");

    // Asignar clases y texto a los botones
    editarButton.className = "editar-btn";
    editarButton.textContent = "Editar";
    eliminarButton.className = "eliminar-btn";
    eliminarButton.textContent = "Eliminar";

   
// Event listener para el botón de edición
editarButton.addEventListener("click", async function () {
    const mensajeSeleccionado = Mensajote;

    if (mensajeSeleccionado) {
        const mensajeIdSeleccionado = parseInt(mensajeSeleccionado.getAttribute("data-id_mensaje"), 10);
        const idUsuarioDelMensaje = mensajesTabla[mensajeIdSeleccionado];

        if (userId === idUsuarioDelMensaje) {
            // El usuario activo es el propietario del mensaje
            try {
                // Realiza una solicitud GET al servidor para obtener el contenido del mensaje
                const response = await fetch(`http://127.0.0.1:5000/usuarios/servers/${id_servidorSeleccionado}/canales/${id_canalSeleccionado}/mensajes/${mensajeIdSeleccionado}`, {
                    method: "GET",
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.contenido) {
                        // Obtén el contenido actual del mensaje
                        const mensajeContenidoElement = mensajeSeleccionado.querySelector("strong:last-of-type + strong");
                        console.log(mensajeContenidoElement);
                        const mensajeContenido = data.contenido;
                        console.log(mensajeContenido)

                        // Pide al usuario que ingrese el nuevo contenido del mensaje
                        const nuevoContenido = prompt("Editar mensaje:", mensajeContenido);

                        if (nuevoContenido !== null) {
                            // Actualiza el contenido del mensaje en el DOM
                            //mensajeContenidoElement = nuevoContenido;

                            // Realiza una solicitud al servidor para actualizar el mensaje
                            const canalIdSeleccionado = parseInt(canalSeleccionadoElement.getAttribute("data-canalid"), 10);

                            const mensajeActualizado = {
                                contenido: nuevoContenido,
                            };

                            const actualizarResponse = await fetch(`http://127.0.0.1:5000/usuarios/servers/${id_servidorSeleccionado}/canales/${canalIdSeleccionado}/mensajes/${mensajeIdSeleccionado}`, {
                                method: "PUT",
                                credentials: "include",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(mensajeActualizado),
                            });

                            if (actualizarResponse.ok) {
                                alert("Mensaje actualizado exitosamente.");
                            } else {
                                alert("Error al actualizar el mensaje.");
                            }
                        }
                    } else {
                        alert("No se pudo obtener el contenido del mensaje desde el servidor.");
                    }
                } else {
                    console.error("Error al obtener el contenido del mensaje:", response.statusText);
                    alert("Error al obtener el contenido del mensaje desde el servidor.");
                }
            } catch (error) {
                console.error("Error general:", error);
                alert("Error al realizar la edición del mensaje. Por favor, inténtelo de nuevo.");
            }
        } else {
            alert("Usted no es el propietario de este mensaje y no tiene permiso para editarlo.");
        }
    } else {
        alert("No se ha seleccionado ningún mensaje para editar.");
    }
});
    // Event listener para el botón de eliminación
    eliminarButton.addEventListener("click", function () {
        const mensajeSeleccionado = Mensajote; 
    
        if (mensajeSeleccionado) {
            const idUsuarioDelMensaje = mensajesTabla[mensajeId];
    
            if (userId === idUsuarioDelMensaje) {
                // El usuario activo es el propietario del mensaje
                // Implementa la lógica para eliminar el mensaje aquí
                fetch(`http://127.0.0.1:5000/usuarios/servers/${id_servidorSeleccionado}/canales/${id_canalSeleccionado}/mensajes/${mensajeId}`, {
                    method: "DELETE",
                    credentials: 'include'
                })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message === "Mensaje eliminado exitosamente") {
                        // Eliminar el mensaje del DOM
                        mensajeSeleccionado.remove();
                    } else {
                        alert("No tienes permiso para borrar este mensaje o ha pasado más de 1 minuto");
                    }
                })
                .catch((error) => {
                    console.error("Error al eliminar el mensaje:", error);
                    alert("Error al eliminar el mensaje. Por favor, inténtelo de nuevo.");
                });
            } else {
                alert("Usted no es el propietario de este mensaje.");
            }
        } else {
            alert("No se ha seleccionado ningún mensaje para eliminar.");
        }
    });

    // Crear un div para contener los botones y agregarlos
    const botonesDiv = document.createElement("div");
    botonesDiv.className = "mensaje-buttons";
    botonesDiv.appendChild(editarButton);
    botonesDiv.appendChild(eliminarButton);

    return botonesDiv;
}
//termina aqui
// Event listener para abrir la ventana de unirse a un servidor
document.getElementById("unirseServidorButton").addEventListener("click", function () {
    // Abrir una nueva ventana para la lista de servidores disponibles
    const nuevaVentana = window.open(`join_server.html?userId=${userId}`, "_blank", "width=600,height=400");

    // Event listener para detectar cuando se cierre la nueva ventana
    nuevaVentana.addEventListener("beforeunload", function () {
        // Actualizar la lista de servidores del usuario cuando se cierre la nueva ventana
        cargarServidoresDelUsuario();
    });
});
