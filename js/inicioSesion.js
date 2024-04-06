//constantes para la interaccion con el html
const inputcedula = document.querySelector(".cedula");
const inputContrasenia = document.querySelector(".contrasenia");

//variables para los intentos fallidos.
let intentosFallidos = 0;
const intentosMaximo = 3; // Número máximo de intentos permitidos
const tiempoEspera = 30000; // Tiempo de bloqueo en milisegundos (30 segundos en este ejemplo)
let isBloqueado = false;


document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("formulario");

    formulario.addEventListener("submit", (event) => {
        event.preventDefault();

        if (isBloqueado) {
            alert('El inicio de sesión está bloqueado. Por favor, espere unos momentos antes de intentarlo de nuevo.');
            return;
        }

        const { cedula, contrasenia } = obtenerDatosFormulario();

        const esValido = validarContrasenia(contrasenia) && validarCedula(cedula);

        //si el formato es correcto 
        if (esValido) {

            let paciente = buscarPacientePorCedulaYContraseña(cedula, encriptarMD5(contrasenia));

            if (paciente) {
                alert("Paciente autenticado");
                guardarInicioSesion(paciente);
                window.location.href = 'citas.html';
            } else {
                intentosFallidos++;
                if (intentosFallidos >= intentosMaximo) {
                    isBloqueado = true;
                    setTimeout(() => {
                        isBloqueado = false;
                        intentosFallidos = 0; // Reiniciar el contador después del bloqueo
                    }, tiempoEspera);
                    alert(`Demasiados intentos fallidos. El inicio de sesión estará bloqueado durante ${tiempoEspera / 1000} segundos.`);
                }
            }

        } else {
            alert("datos invalidos");
        }
    });




}); //para que escuche a todo el documento y el metodo con la flecha es una funcion flecha que sea anonima

//en caso de que haya un mal formato
const manejarError = () => {
    alert("datos invalidos");
}

//en caso de que los datos coincidan
const manejarExito = () => {
    alert("inicio de sesión exitoso");
    limpiarCamposTexto();
    intentosFallidos = 0;
}

//limpia todos los campos de texto
const limpiarCamposTexto = () => {
    const campos = document.querySelectorAll("#formulario input[type='password'],#formulario input[type='text']");
    campos.forEach((campo) => campo.value = "");

};

/*
VALIDACIONES DE FORMATO
*/
const validarCedula = (cedula) => {
    var regexCedula = /^\d{2}-\d{4}-\d{4}$/;


    if (regexCedula.test(cedula)) {
        return true;
    } else {
        return false;
    }

}

const validarContrasenia = (contrasenia) => {

    var regexContrasena = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[$&+,:;=@#|'<>.^*()%!-])[^\s?]{1,11}$/;


    if (regexContrasena.test(contrasenia)) {
        return true;
    } else {
        return false;
    }
}

//obtiene los datos de los inputs.
const obtenerDatosFormulario = () => {

    const cedula = document.getElementById("cedula").value.trim();
    const contrasenia = document.getElementById("contrasenia").value.trim();

    return { cedula, contrasenia };

};

//formatos validaciones en linea

inputcedula.addEventListener("input", (e) => {

    inputcedula.value = inputcedula.value.replace(/[^0-9-]/g, "");
    if (inputcedula.value.length === 2) {
        inputcedula.value += "-";
    }

    if (inputcedula.value.length === 7) {
        inputcedula.value += "-";
    }

    if (inputcedula.value.length > 12) {
        inputcedula.value = inputcedula.value.slice(0, 12);
    }


    if (e.inputType === "deleteContentBackward") {
        if (inputcedula.value.length === 3) {
            inputcedula.value = inputcedula.value.slice(0, 2);
        }

        if (inputcedula.value.length === 8) {
            inputcedula.value = inputcedula.value.slice(0, 7);
        }

    }
});

inputContrasenia.addEventListener("input", (e) => {




    if (inputContrasenia.value.length > 11) {
        inputContrasenia.value = inputContrasenia.value.slice(0, 11);
    }


});