//variables de interaccion con el html.
inputcedula=document.querySelector(".cedula");
inputContrasenia=document.querySelector(".contrasenia");
inputConfirmacion=document.querySelector(".confirmacion");
inputNombre=document.querySelector(".Nombre");
inputApellido=document.querySelector(".Apellido");
inputCelular=document.querySelector(".celular");


document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("formulario");

    formulario.addEventListener("submit", (event) => {
        event.preventDefault();

        const { cedula, nombre, apellido, celular, correo, contrasenia, confirmacion } = obtenerDatosFormulario();

        const esValido = validarCedula(cedula) && validarNombre(nombre) && validarApellido(apellido) && validarCelular(celular)
            && validarCorreo(correo) && validarContrasenia(contrasenia, confirmacion);

            //si todos los formatos son validos
        if (esValido) {
            let contraseniaEncriptada=encriptarMD5(contrasenia);
            let nuevoPaciente = [{
                "cedula": cedula,
                "nombre": nombre,
                "apellido": apellido,
                "celular": celular,
                "correo": correo,
                "contrasenia": contraseniaEncriptada
            }];

            const mensaje=añadirPaciente(nuevoPaciente);

            if (mensaje){
                manejarExito();
            }else{
                alert("ya existe una persona registrada con esta cedula");
            }

            

        }else{
          
                manejarError();
            
        }

    });




}); //para que escuche a todo el documento y el metodo con la flecha es una funcion flecha que sea anonima

//funcion en caso de que el formato sea invalido
const manejarError = () => {
    alert("datos invalidos");
}

//funcion en caso de que se registre correctamente
const manejarExito = () => {
    alert("Registro exitoso");
    limpiarCamposTexto();
}

//vacia los inputs
const limpiarCamposTexto = () => {
    const campos = document.querySelectorAll("#formulario input[type='password'],#formulario input[type='email'],#formulario input[type='text']");
    campos.forEach((campo) => campo.value = "");

};

//obtiene los datos de los inputs
const obtenerDatosFormulario = () => {

    const cedula = document.getElementById("cedula").value.trim();
    const nombre = document.getElementById("Nombre").value.trim();
    const apellido = document.getElementById("Apellido").value.trim();
    const celular = document.getElementById("celular").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const contrasenia = document.getElementById("contrasenia").value.trim();
    const confirmacion = document.getElementById("confirmacion").value.trim();

    return { cedula, nombre, apellido, celular, correo, contrasenia, confirmacion };


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

const validarContrasenia = (contrasenia, confirmacion) => {

    var regexContrasena = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[$&+,:;=@#|'<>.^*()%!-])[^\s?]{1,11}$/;

    if (regexContrasena.test(contrasenia) && contrasenia == confirmacion) {
        return true;
    } else {
        return false;
    }
}

const validarNombre = (nombre) => {
    var regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,20}$/;


    if (regexNombre.test(nombre)) {
        return true;
    } else {
        return false;
    }
}

const validarApellido = (apellido) => {

    var regexApellido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{1,30}$/;


    if (regexApellido.test(apellido)) {
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


inputConfirmacion.addEventListener("input", (e)=>{




    if(inputConfirmacion.value.length >11){
        inputConfirmacion.value=inputConfirmacion.value.slice(0,11);
    }

    
});

inputNombre.addEventListener("input", (e)=>{
    inputNombre.value = inputNombre.value.replace(/[^a-zA-Z ]/g, '');



    if(inputNombre.value.length >20){
        inputNombre.value=inputNombre.value.slice(0,20);
    }

    
});


inputApellido.addEventListener("input", (e)=>{
    inputApellido.value=inputApellido.value.replace(/[^a-zA-Z ]/g, '');



    if(inputApellido.value.length >30){
        inputApellido.value=inputApellido.value.slice(0,30);
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




