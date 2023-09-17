document.addEventListener("DOMContentLoaded", function () {
    // JavaScript para manejar la validación del formulario
    document.getElementById("login-form").addEventListener("submit", function (event) {
        event.preventDefault(); // Evita el envío predeterminado del formulario

        const email = document.getElementById("username").value;
        const contraseña = document.getElementById("password").value;
        
        // Crear un objeto para representar el JSON
        const requestBody = { email, contraseña };

        // Convertir el objeto a una cadena JSON y mostrarlo en la consola 
        console.log(JSON.stringify(requestBody));

       
        // Realiza la solicitud a la API de Flask
        fetch("http://127.0.0.1:5000/usuarios/login", { 
            method: "POST",
            body: JSON.stringify({ email, contraseña }),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include'
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    // Redirige al usuario a la página de inicio si la autenticación es exitosa
                    window.location.href = "/templates/home.html";
                } else {
                    alert("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
                }
            })
            .catch((error) => {
                console.error("Error de autenticación:", error);
            });
    });
});
