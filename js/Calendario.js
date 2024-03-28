const calendario = document.querySelector(".calendario");
const fecha = document.querySelector(".fecha");
const contenedorDias = document.querySelector(".dias");
const previo = document.querySelector(".prev");
const siguiente = document.querySelector(".next");
const boton_hoy = document.querySelector(".boton-hoy");
const boton_ir = document.querySelector(".ir-boton");
const inputFecha = document.querySelector(".fecha-input");
const diaEvento=document.querySelector(".dia-evento");
const fechaEvento=document.querySelector(".fecha-evento");
const contenedorEventos=document.querySelector(".eventos");
const addEventosSubmit=document.querySelector(".add-evento-boton");
const addEventoBoton = document.querySelector(".add-evento");
const addEventoContainer = document.querySelector(".add-evento-contenedor");
const addEventoCloseBtn = document.querySelector(".close");
const addEventoTitulo = document.querySelector(".nombre-evento");
const addEventoHoraInicio = document.querySelector(".tiempo-inicio");
const addEventoHoraFinalizado = document.querySelector(".tiempo-final");

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

let eventosArreglo=[];
obtenerCitas();


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
            diaActivo=i;
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

previo.addEventListener("click", mesPrevio);
siguiente.addEventListener("click", mesSiguiente);


//botones de hoy e ir

boton_hoy.addEventListener("click", () => {
    hoy = new Date();
    mes = hoy.getMonth();
    anio = hoy.getFullYear();
    inicioCalendario();
});

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

// funciones para la citas




addEventoBoton.addEventListener("click", () => {
    addEventoContainer.classList.toggle("activo");
});

addEventoCloseBtn.addEventListener("click", () => {
    addEventoContainer.classList.remove("activo");
});

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

//formato de tiempos
addEventoHoraInicio.addEventListener("input", (e) => {
    addEventoHoraInicio.value = addEventoHoraInicio.value.replace(/[^0-9:]/g, "");
    if (addEventoHoraInicio.value.length === 2) {
        addEventoHoraInicio.value += ":";
    }

    if (addEventoHoraInicio.value.length > 5) {
        addEventoHoraInicio.value = addEventoHoraInicio.value.slice(0, 5);
    }
});

addEventoHoraFinalizado.addEventListener("input", (e) => {
    addEventoHoraFinalizado.value = addEventoHoraFinalizado.value.replace(/[^0-9:]/g, "");
    if (addEventoHoraFinalizado.value.length === 2) {
        addEventoHoraFinalizado.value += ":";
    }

    if (addEventoHoraFinalizado.value.length > 5) {
        addEventoHoraFinalizado.value = addEventoHoraFinalizado.value.slice(0, 5);
    }
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
            } else   if (e.target.classList.contains("fecha-siguiente")) {
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
            } else{
                //si se escoge un dia del mes actual.
                e.target.classList.add("activo");
            }
        });
    });
}


function obtenerDiaActivo(fecha){
    const dia= new Date(anio,mes,fecha);
    const nombreDia=dia.toString().split(" ")[0];

    diaEvento.innerHTML=nombreDia;
    fechaEvento.innerHTML= fecha+ " " + meses[mes]+ " "+ anio;

}

function  actualizarEventos(fecha) {
    let eventos="";
    eventosArreglo.forEach((evento)=>{

        if (fecha===evento.dia && mes+1=== evento.mes && anio===evento.anio) {
            //ver los eventos del documento

            evento.eventos.forEach((evento)=>{
                eventos+=`
                <div class="evento">
                    <div class="titulo">
                        <i class="fas fa-circle"></i>
                        <h3 class="titulo-evento">${evento.titulo}</h3>
                    </div>
                    <div class="tiempo-evento">
                        <span class="tiempo-evento">${evento.tiempo}</span>
                    </div>
                </div>
                `;
            });

        }
    });

    //si no encuentra nada
    if(eventos===""){
        eventos=`<div class="sin-evento">
                    <h3>Sin citas</h3>
                    </div>`;
    }

    contenedorEventos.innerHTML=eventos;

    //salvamos las citas cuando se agrega una nueva
    guardarCitas();
    
}

//funcion para añadir citas
addEventosSubmit.addEventListener("click",()=>{
    const tituloEvento=addEventoTitulo.value;
    const horaInicioEvento=addEventoHoraInicio.value;
    const horaFinalizadoEvento=addEventoHoraFinalizado.value;

    //algunas validaciones

    if (tituloEvento ==="" || horaInicioEvento==="" || horaFinalizadoEvento ==="") {
        alert("Por favor, rellena todos los espacios correspondientes");
        return;
    }

    const arregloHoraInicio= horaInicioEvento.split(":");
    const arregloHoraFInalizado= horaFinalizadoEvento.split(":");

    if (arregloHoraInicio.length !== 2 ||
        arregloHoraFInalizado.length !== 2 ||
        arregloHoraInicio[0]>23 ||
        arregloHoraFInalizado[0]> 23||
        arregloHoraInicio[1]> 59 ||
        arregloHoraFInalizado[1]>59 ) {
            alert("formato de hora invalido");
            return;
        
    }

    const tiempoInicio=convertTime(horaInicioEvento);
    const tiempoFinalizado=convertTime(horaFinalizadoEvento);

    const nuevoEvento={
        titulo: tituloEvento,
        tiempo: horaInicioEvento +" - " + horaFinalizadoEvento,
    };

    let eventoAnanido=false;


    //verificamos que el arreglo de eventos no esté vacio
    if (eventosArreglo.length>0) {
        
        eventosArreglo.forEach((item)=>{
            if(item.dia ===diaActivo &&
               item.mes === mes+1 &&
               item.anio === anio){
                item.eventos.push(nuevoEvento)
                //acá valido la hora pero lo hago otro dia para los conflictos de horario




                eventoAnanido=true;
            }

        });
    }

    if(!eventoAnanido){
        eventosArreglo.push({
            dia: diaActivo,
            mes: mes+1,
            anio: anio,
            eventos: [nuevoEvento],
        });
    }

    //removemos el activo
    addEventoContainer.classList.remove("activo");

    //limpiamos los campos
    addEventoTitulo.value="";
    addEventoHoraInicio.value="";
    addEventoHoraFinalizado.value="";

    //actualizamos los eventos
    actualizarEventos(diaActivo);

    const elementoDiaActivo=document.querySelector(".dia.activo");
    if (!elementoDiaActivo.classList.contains("evento")) {
        elementoDiaActivo.classList.add("evento");
    }
});

function convertTime(tiempo){
    let arregloTiempo= tiempo.split(":");
    let hora=arregloTiempo[0];
    let minutos=arregloTiempo[1];
    let formato=hora>=12? "PM":"AM";
    hora=hora % 12 || 12;
    tiempo= hora + ":" + minutos+ " "+ formato;
    return tiempo;
}

//funcion para remover elementos
contenedorEventos.addEventListener("click", (e)=>{
    if (e.target.classList.contains("evento")) {
        const tituloEvento= e.target.children[0].children[1].innerHTML;

        eventosArreglo.forEach((evento)=>{
           if (evento.dia=== diaActivo &&
            evento.mes === mes+1 &&
            evento.anio === anio){
                evento.eventos.forEach((item,index)=>{
                    if (item.titulo === tituloEvento) {
                    evento.eventos.splice(index,1);     
                    }
                });
                // si no hay eventos para remover
                if (evento.eventos.length===0) {
                    eventosArreglo.splice(eventosArreglo.indexOf(evento),1);

                    const elementoDiaActivo=document.querySelector(".dia.activo");
                    if (elementoDiaActivo.classList.contains("evento")) {
                        elementoDiaActivo.classList.remove("evento");
                    }
                }

            }
        });
        actualizarEventos(diaActivo);
    }
});

//guardamos las citas en el local storage
function guardarCitas(){
    localStorage.setItem("citas", JSON.stringify(eventosArreglo));
}

function obtenerCitas(){
    if (localStorage.getItem("citas" !== null)) {
        eventosArreglo.push(...JSON.parse(localStorage.getItem("citas")));
    }
    
    return;
}