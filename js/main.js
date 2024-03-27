

//FUNCTIONS

function guardarStorage(pacientes) {
    const arregloString = JSON.stringify(pacientes);
    localStorage.setItem('pacientesGuardados', arregloString);
}

function extraerStorage() {
    let arregloStringRecuperado = localStorage.getItem('pacientesGuardados');
    pacientes = JSON.parse(arregloStringRecuperado);
    console.log("storage" + pacientes);
    return pacientes;
}


function añadirPaciente(paciente) {
    console.log("main " + paciente[0].apellido);
    let pacientesObtenidos = extraerStorage() || [];
    let cedulaExistente = pacientesObtenidos.some(p => p.cedula === paciente[0].cedula);
    if (!cedulaExistente) {
        pacientesObtenidos.push({
            "cedula": paciente[0].cedula,
            "nombre": paciente[0].nombre,
            "apellido": paciente[0].apellido,
            "celular": paciente[0].celular,
            "correo": paciente[0].correo,
            "contrasenia": paciente[0].contrasenia
        });
        guardarStorage(pacientesObtenidos);
        return true;

    }

    return false;
}




function buscarPacientePorCedulaYContraseña(cedulaBuscada, contraseniaBuscada) {
    let pacientes = extraerStorage();
    console.log("busqueda " + pacientes);
    let pacienteEncontrado = pacientes.find(pacientes => pacientes.cedula === cedulaBuscada);

    if (pacienteEncontrado && pacienteEncontrado.contrasenia === contraseniaBuscada) {
        console.log("Paciente encontrado y contraseña correcta:");
        console.log(pacienteEncontrado);
        return pacienteEncontrado;
    } else {
        console.log("Paciente no encontrado o contraseña incorrecta");
        return null;
    }
}