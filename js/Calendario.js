//constantes necesarias para toda la interaccion con el html.
const calendario = document.querySelector(".calendario");
const fecha = document.querySelector(".fecha");
const contenedorDias = document.querySelector(".dias");
const previo = document.querySelector(".prev");
const siguiente = document.querySelector(".next");
const boton_hoy = document.querySelector(".boton-hoy");
const boton_ir = document.querySelector(".ir-boton");
const inputFecha = document.querySelector(".fecha-input");
const diaEvento = document.querySelector(".dia-evento");
const fechaEvento = document.querySelector(".fecha-evento");
const contenedorEventos = document.querySelector(".eventos");
const addEventosSubmit = document.querySelector(".add-evento-boton");
const addEventoBoton = document.querySelector(".add-evento");
const addEventoContainer = document.querySelector(".add-evento-contenedor");
const addEventoCloseBtn = document.querySelector(".close");
const addEventoTitulo = document.querySelector(".nombre-evento");


const selectDoctores = document.querySelector(".doctores");
const selectEspecializacion = document.querySelector(".especializacion");
const selectHorarios = document.querySelector(".Horario");

//el arreglo en el cual almacenamos los medicos que extraemos del json.
let medicos = [];

// Función para cargar y procesar el archivo JSON
async function cargarJSON() {
    try {
        // Obtener el archivo JSON utilizando fetch
        const response = await fetch('js/medicos.json');

        // Verificar si la respuesta es exitosa
        if (!response.ok) {
            throw new Error('Error al obtener el archivo JSON');
        }

        // Obtener los datos del archivo JSON
        const datos = await response.json();

        // Almacenar los datos en el arreglo
        medicos = datos;

        // Mostrar los datos en la consola (opcional)
        cargarSelect();


    } catch (error) {
        console.error('Error:', error);
    }
}

// Llamar a la función para cargar y procesar el archivo JSON
cargarJSON();

//funcion para cargar dinamicamente el nombre completo de los medicos y su especialidad en los select, 
//además de las horas en las cuales la se pueden sacar citas. 
function cargarSelect() {
    let nombresMedicos = "";
    let especializaciones = "";
    let horarios = "";
    medicos.forEach(medico => {
        nombresMedicos += `<option value="${medico.nombreCompleto}">${medico.nombreCompleto}</option>`;
        especializaciones += `<option value="${medico.especialidad}">${medico.especialidad}</option>`;
    });

    for (let index = 7; index < 18; index++) {
        if (index < 10) {
            horarios += `<option value="${index}">${"0" + index + ":00"}</option>`;
        } else {
            horarios += `<option value="${index}">${index + ":00"}</option>`;
        }
    }
    selectDoctores.innerHTML = nombresMedicos;
    selectEspecializacion.innerHTML = especializaciones;
    selectHorarios.innerHTML = horarios;
}

// se crean las variables y constantes para hacer las funciones con las fechas y calendarios.
let hoy = new Date();
let diaActivo;
let mes = hoy.getMonth();
let anio = hoy.getFullYear();

const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"];

let eventosArreglo = obtenerCitas() || [];
const paciente = extraerInicioSesion();

//funcion para añadir dias
function inicioCalendario() {

    //para obtener los dias del mes anterior, del mes actual y del siguiente mes.
    const primerDia = new Date(anio, mes, 1);
    const ultimoDia = new Date(anio, mes + 1, 0);
    const prevUltimoDia = new Date(anio, mes, 0);
    const diasPrevios = prevUltimoDia.getDate();
    const ultimaFecha = ultimoDia.getDate();
    const dia = primerDia.getDay();
    const diasSiguientes = 7 - ultimoDia.getDay() - 1;

    //actualizar la fecha de arriba del calendario

    fecha.innerHTML = meses[mes] + " " + anio;


    //actualizar dias

    let days = "";
    //dias previos
    for (let x = dia; x > 0; x--) {
        days += `<div class="dia fecha-previa">${diasPrevios - x + 1}</div>`;
    }

    //dias del mes actual

    for (let i = 1; i <= ultimaFecha; i++) {

        //verificamos si tiene citas el dia presente
        let evento = false;
        eventosArreglo.forEach((eventoObj) => {
            if (eventoObj.dia === i &&
                eventoObj.mes === mes + 1 &&
                eventoObj.anio === anio) {
                evento = true;
            }
        })

        //si el dia es hoy, que añada la clase hoy
        if (i === new Date().getDate() && anio === new Date().getFullYear() && mes === new Date().getMonth()) {
            diaActivo = i;
            obtenerDiaActivo(i);
            actualizarEventos(i);


            if (evento) {
                days += `<div class="dia hoy activo evento">${i}</div>`;
            } else {
                days += `<div class="dia hoy activo">${i}</div>`;
            }
        } else {
            if (evento) {
                days += `<div class="dia evento">${i}</div>`;
            } else {
                days += `<div class="dia">${i}</div>`;
            }
        }
    }

    //dias del mes siguiente
    for (let j = 1; j <= diasSiguientes; j++) {
        days += `<div class="dia fecha-siguiente">${j}</div>`;

    }

    contenedorDias.innerHTML = days;

    addListner();

}

//llama la funcion que inicia y llena el calendario
inicioCalendario();

//mes previo

function mesPrevio() {
    mes--;
    if (mes < 0) {
        mes = 11;
        anio--;
    }
    inicioCalendario();
}

//mes siguiente

function mesSiguiente() {
    mes++;
    if (mes > 11) {
        mes = 0;
        anio++;
    }
    inicioCalendario();
}

//listeners para las flechas de mes previo y mes siguiente.
previo.addEventListener("click", mesPrevio);
siguiente.addEventListener("click", mesSiguiente);


//botones de hoy e ir

boton_hoy.addEventListener("click", () => {
    hoy = new Date();
    mes = hoy.getMonth();
    anio = hoy.getFullYear();
    inicioCalendario();
});

//validacion en linea de la fecha 
inputFecha.addEventListener("input", (e) => {

    inputFecha.value = inputFecha.value.replace(/[^0-9/]/g, "");
    if (inputFecha.value.length === 2) {
        inputFecha.value += "/";
    }

    if (inputFecha.value.length > 7) {
        inputFecha.value = inputFecha.value.slice(0, 7);
    }
    if (e.inputType === "deleteContentBackward") {
        if (inputFecha.value.length === 3) {
            inputFecha.value = inputFecha.value.slice(0, 2);
        }

    }
});

boton_ir.addEventListener("click", irFecha);
// funcion para ir a la fecha solicitada
function irFecha() {
    const dateArr = inputFecha.value.split("/");

    if (dateArr.length === 2) {
        if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
            mes = dateArr[0] - 1;
            anio = dateArr[1];
            inicioCalendario();
            return;
        }
    }

    alert("datos invalidos");
}

/*+++++++++++++++++++++
FUNCIONES PARA CITAS
+++++++++++++++++++++++*/



//boton para presentar el modal de solicitud de citas
addEventoBoton.addEventListener("click", () => {
    addEventoContainer.classList.toggle("activo");
});

//boton para cerrar modal
addEventoCloseBtn.addEventListener("click", () => {
    addEventoContainer.classList.remove("activo");
});

//funcion para cerrar el modal
document.addEventListener("click", (e) => {
    //si se da click fuera
    if (e.target !== addEventoBoton && !addEventoContainer.contains(e.target)) {
        addEventoContainer.classList.remove("activo");
    }
});

//formato de validaciones
addEventoTitulo.addEventListener("input", (e) => {
    addEventoTitulo.value = addEventoTitulo.value.slice(0, 50);
});


//funciones para añadir citas
function addListner() {
    const dias = document.querySelectorAll(".dia");
    dias.forEach((dia) => {
        dia.addEventListener("click", (e) => {
            //se establece el dia actual como dia principal
            diaActivo = Number(e.target.innerHTML);

            //llamamos a la fecha activa para cambiar el dato del encabezado de los eventos.
            obtenerDiaActivo(e.target.innerHTML);
            actualizarEventos(Number(e.target.innerHTML));


            dias.forEach((dia) => {
                dia.classList.remove("activo");
            });

            //si se escoge un dia del mes anterior se va a ese mes
            if (e.target.classList.contains("fecha-previa")) {
                mesPrevio();

                setTimeout(() => {

                    const dias = document.querySelectorAll(".dia");

                    dias.forEach((dia) => {
                        if (
                            !dia.classList.contains("fecha-previa") &&
                            dia.innerHTML === e.target.innerHTML) {
                            dia.classList.add("activo");

                        }
                    });
                }, 100);
                // lo mismo con los dias del mes siguiente
            } else if (e.target.classList.contains("fecha-siguiente")) {
                mesSiguiente();

                setTimeout(() => {

                    const dias = document.querySelectorAll(".dia");

                    dias.forEach((dia) => {
                        if (
                            !dia.classList.contains("fecha-siguiente") &&
                            dia.innerHTML === e.target.innerHTML) {
                            dia.classList.add("activo");

                        }
                    });
                }, 100);
            } else {
                //si se escoge un dia del mes actual.
                e.target.classList.add("activo");
            }
        });
    });
}

//funcion para obtener el dia activo en el cual vamos a agendar citas
function obtenerDiaActivo(fecha) {
    const dia = new Date(anio, mes, fecha);
    const nombreDia = dia.toString().split(" ")[0];

    diaEvento.innerHTML = nombreDia;
    fechaEvento.innerHTML = fecha + " " + meses[mes] + " " + anio;

}

// Es la función con la que se carga las citas al calendario dependiendo de la fecha en la que se seleccione
function actualizarEventos(fecha) {
    let eventos = "";
    eventosArreglo.forEach((evento) => {

        if (fecha === evento.dia && mes + 1 === evento.mes && anio === evento.anio) {
            //ver los eventos del documento

            evento.eventos.forEach((evento) => {
                eventos += `
                <div class="evento">
                    <div class="titulo">
                        <i class="fas fa-circle"></i>
                        <h3 class="titulo-evento">${"Paciente: " + evento.nombrePaciente}</h3>
                        <h3 class="titulo-evento">${"Médico: " + evento.nombreMedico}</h3>
                        <h3 class="titulo-evento">${"Tipo de cita: " + evento.especializacionMedico}</h3>
                    </div>
                    <div class="tiempo-evento">
                        <span class="tiempo-evento">${"hora de cita: " + evento.horario + ":" + "00"}</span>
                        <span class="tiempo-evento">${"Estado de la cita: " + evento.estado}</span>
                    </div>
                </div>
                `;
            });

        }
    });

    //si no encuentra nada
    if (eventos === "") {
        eventos = `<div class="sin-evento">
                    <h3>Sin citas</h3>
                    </div>`;
    }

    contenedorEventos.innerHTML = eventos;

}

//funcion para añadir citas
addEventosSubmit.addEventListener("click", () => {
    const nombreMedico = selectDoctores.value;
    const especializacionMedico = selectEspecializacion.value;
    const horario = selectHorarios.value;

    //algunas validaciones
    let medico = medicos.find(m => m.nombreCompleto === nombreMedico && m.especialidad === especializacionMedico);

    if (!medico) {
        alert("el medico y la especialidad no coincide, por favor verifica que estos datos estén correctos.");
        return;
    }

    const nuevoEvento = {
        nombreMedico: nombreMedico,
        id_medico: medico.identificacion,
        especializacionMedico: especializacionMedico,
        horario: horario,
        id_paciente: paciente.cedula,
        nombrePaciente: paciente.nombre + " " + paciente.apellido,
        estado: "pendiente",


    };

    let eventoAnanido = false;


    //verificamos que el arreglo de eventos no esté vacio
    if (eventosArreglo.length > 0) {

        eventosArreglo.forEach((item) => {
            if (item.dia === diaActivo &&
                item.mes === mes + 1 &&
                item.anio === anio) {
                let repetido = false;

                item.eventos.forEach(evento => {
                    if (evento.horario === nuevoEvento.horario) {
                        repetido = true;
                    }
                });
                if (!repetido) {
                    item.eventos.push(nuevoEvento);
                } else {
                    alert("ya existe una cita asignada a esta hora");
                }




                eventoAnanido = true;
            }

        });
    }

    if (!eventoAnanido) {
        eventosArreglo.push({
            dia: diaActivo,
            mes: mes + 1,
            anio: anio,
            eventos: [nuevoEvento],
        });
    }

    //removemos el activo
    addEventoContainer.classList.remove("activo");


    //actualizamos los eventos
    actualizarEventos(diaActivo);
    guardarCitas(eventosArreglo);

    const elementoDiaActivo = document.querySelector(".dia.activo");
    if (!elementoDiaActivo.classList.contains("evento")) {
        elementoDiaActivo.classList.add("evento");
    }
});



//funcion para remover elementos
contenedorEventos.addEventListener("click", (e) => {
    if (e.target.classList.contains("evento")) {
        const nombrePaciente = e.target.children[0].children[1].innerHTML;
        const nombreMedico = e.target.children[0].children[2].innerHTML;
        console.log(nombreMedico);
        eventosArreglo.forEach((evento) => {
            if (evento.dia === diaActivo &&
                evento.mes === mes + 1 &&
                evento.anio === anio) {

                evento.eventos.forEach((item, index) => {
                    if (nombrePaciente.includes(item.nombrePaciente) && nombreMedico.includes(item.nombreMedico)) {
                        if ((paciente.nombre + " " + paciente.apellido) === item.nombrePaciente) {
                            evento.eventos.splice(index, 1);
                        } else {
                            alert("no puedes eliminar las citas de otros pacientes.");
                        }

                    }
                });
                // si no hay eventos para remover
                if (evento.eventos.length === 0) {
                    eventosArreglo.splice(eventosArreglo.indexOf(evento), 1);

                    const elementoDiaActivo = document.querySelector(".dia.activo");
                    if (elementoDiaActivo.classList.contains("evento")) {
                        elementoDiaActivo.classList.remove("evento");
                    }
                }

            }
        });
        actualizarEventos(diaActivo);
        guardarCitas(eventosArreglo);
    }
});



