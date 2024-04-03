

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
    if (cedulaBuscada==="01-1234-5678" && contraseniaBuscada==="Admin123.") {
        window.location.href = 'aprobaciónCitas.html';
        return null;
    }
    let pacienteEncontrado = pacientes.find(pacientes => pacientes.cedula === cedulaBuscada);

    if (pacienteEncontrado && pacienteEncontrado.contrasenia === contraseniaBuscada) {
        return pacienteEncontrado;
    } else {
       alert("Contraseña incorrecta");
        return null;
    }
}

function guardarStorageCitas(citas) {
    const arregloCitas = JSON.stringify(citas);
    localStorage.setItem('citas', arregloCitas);
}

function extraerStorageCitas() {
    let arregloStringRecuperado = localStorage.getItem('citas');
    citas = JSON.parse(arregloStringRecuperado);
    console.log("storage" + citas);
    return citas;
}

function añadirCita(cita) {
    let citasObtenidas = extraerStorageCitas() || [];
    let citaExistente = citasObtenidas.some(c => c.fecha === cita[0].fecha && c.hora === cita[0].hora);
    if (!citaExistente) {
        citasObtenidas.push({
            "fecha": cita[0].fecha,
            "hora": cita[0].hora,
            "id_medico": cita[0].id_medico,
            "id-Paciente": cita[0].id_Paciente
        });
        guardarStorageCitas(citasObtenidas);
        return true;

    }

    return false;
}

function guardarInicioSesion(paciente) {
    const pacienteVerificado = JSON.stringify(paciente);
    localStorage.setItem('usuarioActivo', pacienteVerificado);
}

function extraerInicioSesion() {
    let pacienteVerificado = localStorage.getItem('usuarioActivo');
    let paciente = JSON.parse(pacienteVerificado);
    return paciente;
}

//guardamos las citas en el local storage
function guardarCitas(eventosArreglo){
    localStorage.setItem("citas", JSON.stringify(eventosArreglo));
}

function obtenerCitas(){
        let arregloStringRecuperado = localStorage.getItem('citas');
       let cita = JSON.parse(arregloStringRecuperado);
    
    return cita;
}