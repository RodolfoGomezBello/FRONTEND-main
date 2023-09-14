document.addEventListener("DOMContentLoaded", function () {
    // JavaScript para manejar la validación del formulario
    document.getElementById("login-form").addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        // Ejemplo usando fetch():
        fetch("/path-to-your-python-api", {
            method: "POST",
            body: JSON.stringify({ username, password }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    // Redirigir al usuario a la página de inicio si la autenticación es exitosa
                    window.location.href = "/home.html";
                } else {
                    alert("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
                }
            })
            .catch((error) => {
                console.error("Error de autenticación:", error);
            });
    });
});
