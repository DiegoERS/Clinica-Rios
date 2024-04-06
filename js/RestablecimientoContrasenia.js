//constantes para la interaccion con el html
inputcedula=document.querySelector(".cedula");
inputCelular=document.querySelector(".celular");
inputContrasenia=document.querySelector(".contrasenia");
inputConfirmacion=document.querySelector(".confirmacion");


document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("formulario");

    formulario.addEventListener("submit", (event) => {
        event.preventDefault();

        const { cedula, celular, correo, contrasenia, confirmacion } = obtenerDatosFormulario();

        const esValido = validarCedula(cedula) && validarCelular(celular)
            && validarCorreo(correo) && validarContrasenia(contrasenia, confirmacion);

        if (esValido) {
            let contraseniaEncriptada=encriptarMD5(contrasenia);
            let nuevoPaciente = [{
                "cedula": cedula,
                "celular": celular,
                "correo": correo,
                "contrasenia": contraseniaEncriptada
            }];

            const mensaje=cambiarContraseniaPaciente(nuevoPaciente);
            if (mensaje){
                manejarExito();
            }else{
                alert("Los datos proporcionados no coinciden con ningún paciente.");
            }

            

        }else{
          
                manejarError();
            
        }

    });
});

//en caso de que el formato sea invalido
const manejarError = () => {
    alert("datos invalidos");
}
// en caso de que todo se cumpla, se restablece la contraseña
const manejarExito = () => {
    alert("Restablecimiento de contraseña exitoso");
    window.location.href = 'inicioSesion.html';
    limpiarCamposTexto();
}

//funcion que limpia los inputs
const limpiarCamposTexto = () => {
    const campos = document.querySelectorAll("#formulario input[type='password'],#formulario input[type='email'],#formulario input[type='text']");
    campos.forEach((campo) => campo.value = "");

};

//obtiene los datos del formulario
const obtenerDatosFormulario = () => {

    const cedula = document.getElementById("cedula").value.trim();
    const celular = document.getElementById("celular").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const contrasenia = document.getElementById("contrasenia").value.trim();
    const confirmacion = document.getElementById("confirmacion").value.trim();

    return { cedula, celular, correo, contrasenia, confirmacion };


};

//validaciones de formato

const validarCedula = (cedula) => {
    var regexCedula = /^\d{2}-\d{4}-\d{4}$/;


    if (regexCedula.test(cedula)) {
        return true;
    } else {
        return false;
    }

}

const validarContrasenia = (contrasenia, confirmacion) => {

    var regexContrasena = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[$&+,:;=@#|'<>.^*()%!-])[^\s?]{1,11}$/;

    if (regexContrasena.test(contrasenia) && contrasenia == confirmacion) {
        return true;
    } else {
        return false;
    }
}

const validarCelular = (celular) => {
    var regexCelular = /^\d{4}-\d{4}$/;


    if (regexCelular.test(celular)) {
        return true;
    } else {
        return false;

    }
}

const validarCorreo = (correo) => {

    var regexCorreo = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;


    if (regexCorreo.test(correo)) {
        return true;
    } else {
        return false;
    }

}

//formatos validaciones en linea

inputcedula.addEventListener("input", (e)=>{

    inputcedula.value=inputcedula.value.replace(/[^0-9-]/g,"");
    if(inputcedula.value.length ===2){
        inputcedula.value+="-";
    }

    if(inputcedula.value.length ===7){
        inputcedula.value+="-";
    }

    if(inputcedula.value.length >12){
        inputcedula.value=inputcedula.value.slice(0,12);
    }

    
    if (e.inputType=== "deleteContentBackward") {
        if (inputcedula.value.length===3){
            inputcedula.value=inputcedula.value.slice(0,2);
        }

        if (inputcedula.value.length===8){
            inputcedula.value=inputcedula.value.slice(0,7);
        }
        
    }
});

inputContrasenia.addEventListener("input", (e)=>{




    if(inputContrasenia.value.length >11){
        inputContrasenia.value=inputContrasenia.value.slice(0,11);
    }

    
});


inputConfirmacion.addEventListener("input", (e)=>{




    if(inputConfirmacion.value.length >11){
        inputConfirmacion.value=inputConfirmacion.value.slice(0,11);
    }

    
});



inputCelular.addEventListener("input", (e)=>{

    inputCelular.value=inputCelular.value.replace(/[^0-9-]/g,"");
    if(inputCelular.value.length ===4){
        inputCelular.value+="-";
    }


    if(inputCelular.value.length >9){
        inputCelular.value=inputCelular.value.slice(0,9);
    }

    
    if (e.inputType=== "deleteContentBackward") {
        if (inputCelular.value.length===5){
            inputCelular.value=inputCelular.value.slice(0,4);
        }
    }
});




