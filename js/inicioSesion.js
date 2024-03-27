const inputcedula=document.querySelector(".cedula");
const inputContrasenia=document.querySelector(".contrasenia");


document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("formulario");

    formulario.addEventListener("submit", (event) => {
        event.preventDefault();

        const { cedula, contrasenia } = obtenerDatosFormulario();

        const esValido = validarContrasenia(contrasenia) && validarCedula(cedula);

        if (esValido) { 

        let paciente = buscarPacientePorCedulaYContraseña(cedula, contrasenia);
            console.log(pacientes);
        if (paciente) {
            alert("autenticado");
            window.location.href = 'citas.html';
        }

    }else{
        manejarError();
    }
    });




}); //para que escuche a todo el documento y el metodo con la flecha es una funcion flecha que sea anonima


const manejarError = () => {
    alert("datos invalidos");
}

const manejarExito = () => {
    alert("inicio de sesión exitoso");
    limpiarCamposTexto();
}

const limpiarCamposTexto = () => {
    const campos = document.querySelectorAll("#formulario input[type='password'],#formulario input[type='text']");
    campos.forEach((campo) => campo.value = "");

};

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

const obtenerDatosFormulario = () => {

    const cedula = document.getElementById("cedula").value.trim();
    const contrasenia = document.getElementById("contrasenia").value.trim();

    return { cedula, contrasenia };

};

//formatos validaciones

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