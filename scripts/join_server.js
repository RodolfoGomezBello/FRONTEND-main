document.addEventListener("DOMContentLoaded", function () {
    const servidoresDisponiblesDiv = document.getElementById("servidoresDisponiblesDiv");
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");

    // Función para cargar la lista de servidores disponibles
    function cargarServidoresDisponibles() {
        // Realizar una solicitud para obtener la lista de servidores disponibles
        fetch("http://127.0.0.1:5000/usuarios/servers/all", { method: "GET", credentials: 'include' })
            .then((response) => response.json())
            .then((data) => {
                // Mostrar los servidores disponibles en servidoresDisponiblesDiv
                const servidoresHTML = data.map((servidor) => {
                    // Agrega un atributo "data-servidorid" para identificar el servidor
                    return `<h2 class="servidor" data-servidorid="${servidor.id_servidor}">${servidor.nombre}</h2>`;
                });
                servidoresDisponiblesDiv.innerHTML = servidoresHTML.join("");

                // Agrega event listeners a los servidores para seleccionarlos
                const servidores = document.querySelectorAll(".servidor");
                servidores.forEach((servidor) => {
                    servidor.addEventListener("click", function () {
                        // Elimina la clase "selected" de todos los servidores
                        servidores.forEach((s) => s.classList.remove("selected"));
                        // Agrega la clase "selected" al servidor seleccionado
                        servidor.classList.add("selected");
                    });
                });
            })
            .catch((error) => {
                console.error("Error al cargar servidores disponibles:", error);
            });
    }

    // Llama a la función para cargar los servidores disponibles cuando se carga la página
    cargarServidoresDisponibles();

    // Agrega un event listener al botón "Unirse al Servidor"
    const unirseAlServidorButton = document.getElementById("unirseAlServidorButton");
    unirseAlServidorButton.addEventListener("click", function () {
        // Aquí puedes obtener el servidor seleccionado y realizar la lógica para unirse
        const servidorSeleccionado = document.querySelector(".servidor.selected");
        if (servidorSeleccionado) {
            const servidorId = servidorSeleccionado.getAttribute("data-servidorid");
            const data = {
                usuario_id: userId
            };
            
            // Realiza una solicitud POST para unirse al servidor seleccionado
            fetch(`http://127.0.0.1:5000/usuarios/servers/join/${servidorId}`, {
                method: "POST", 
                credentials: 'include'
            })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                if (data.message === "Te has unido al servidor exitosamente") {
                    // Cierra la ventana actual y refresca la página de inicio
                    window.close();
                    window.opener.location.reload();
                } else {
                    alert("Error al unirse al servidor. Por favor, inténtalo de nuevo.");
                }
            })
            .catch((error) => {
                console.error("Error al unirse al servidor:", error);
                alert("Error al unirse al servidor. Por favor, inténtalo de nuevo.");
            });
        } else {
            alert("Por favor, selecciona un servidor antes de unirte.");
        }
    });
});
