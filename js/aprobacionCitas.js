let eventosArreglo = obtenerCitas() || [];

//variables de interaccion con el html
const cuerpoTabla = document.querySelector(".cuerpoTabla");
const addEventoContainer = document.querySelector(".add-evento-contenedor");
const addEventoTitulo = document.querySelector(".add-evento-header");
const addEventoCuerpo = document.querySelector(".add-evento-input");

const addEventoCloseBtn = document.querySelector(".close");
const aceptarBtn = document.querySelector(".aceptar");
const rechazarBtn = document.querySelector(".rechazar");


//funcion para meter los datos a la tabla
function cargarDatosATabla() {
  cuerpoTabla.innerHTML = "";
  let contenido = "";
  let medico=extraerSesionMedico();

  eventosArreglo.forEach((item) => {

    item.eventos.forEach(cita => {
      console.log(cita.id_medico +" y "+medico.identificacion);
      if (cita.id_medico ===medico.identificacion && cita.estado === "pendiente") {
        
          contenido += ` <tr class="fila">
              <th>${item.dia + "/" + item.mes + "/" + item.anio}</th>
              <th>${cita.horario + ":00"}</th>
              <th>${cita.id_paciente}</th>
              <th>${cita.nombrePaciente}</th>
              <th>${cita.nombreMedico}</th>
              <th>${cita.especializacionMedico}</th>
            </tr>`;
        
      }
      
    });
  });

  cuerpoTabla.innerHTML = contenido;
  cargarlistener();
}

cargarDatosATabla();


function cargarlistener() {
  const filas = document.querySelectorAll(".table tr");
  // Agregar evento de clic a cada fila
  filas.forEach(function (fila, indice) {
    // Ignorar la primera fila (encabezados)
    if (indice !== 0) {
      fila.addEventListener("click", function () {
        // Obtener los datos de la fila clicada
        let fecha = fila.cells[0].textContent;
        let hora = fila.cells[1].textContent;
        let idPaciente = fila.cells[2].textContent;




        // Mostrar los datos en la consola (puedes hacer otra acción aquí)
        //accion modal

        //let medico=arregloDatos.find(medico => medico.identificacion === id);
        let citaObtenida = null;

        eventosArreglo.forEach(evento => {
          let fechaEvento = evento.dia + "/" + evento.mes + "/" + evento.anio;
          if (fechaEvento === fecha) {
            evento.eventos.forEach(cita => {
              if ((cita.horario + ":00") === hora && cita.id_paciente === idPaciente) {
                citaObtenida = cita;
              }
            });
          }
        });

        crearModal(fecha, citaObtenida);



      });
    }
  });
}

document.addEventListener("click", (e) => {
  //si se da click fuera
  if (e.target !== aceptarBtn && e.target !== rechazarBtn && addEventoContainer.contains(e.target)) {
    addEventoContainer.classList.remove("activo");
  }
});



function crearModal(fecha, citaObtenida) {
  let titulo = ` <div class="titulo">${"Solicitud de cita"}</div>
    <i class="fas fa-times close"></i>`;

  addEventoTitulo.innerHTML = titulo;

  const addEventoCloseBtn = document.querySelector(".close");
  addEventoCloseBtn.addEventListener("click", () => {
    addEventoContainer.classList.remove("activo");
  });

  

  let informacion = `<p>${"¿Desea aceptar la cita del paciente " + citaObtenida.nombrePaciente + "?"}</p>
                      <p>${"Fecha: " + fecha}</p>
                      <p>${"Hora militar: " + citaObtenida.horario}</p>`;




  addEventoCuerpo.innerHTML = informacion;

  aceptarBtn.addEventListener("click", () => {
    alert("cita aceptada");
    aceptarCita(fecha,citaObtenida);
    addEventoContainer.classList.remove("activo");
  });
  
  rechazarBtn.addEventListener("click", () => {
    alert("cita rechazada");
    rechazarCita(fecha, citaObtenida);
    addEventoContainer.classList.remove("activo");
  });

  addEventoContainer.classList.toggle("activo");

}


function aceptarCita(fecha,citaObtenida) {
  eventosArreglo.forEach((evento)=>{
    let fechaEvento = evento.dia + "/" + evento.mes + "/" + evento.anio;
    if (fechaEvento === fecha){
         
         evento.eventos.forEach((cita)=>{
             if ( (cita.horario + ":00") === (citaObtenida.horario+":00") && cita.id_paciente === citaObtenida.id_paciente) {
             cita.estado="Aceptada";
             }
         });

     }
 });
 cargarDatosATabla();
 guardarCitas(eventosArreglo);
}



function rechazarCita(fecha,citaObtenida) {
  eventosArreglo.forEach((evento)=>{
    let fechaEvento = evento.dia + "/" + evento.mes + "/" + evento.anio;
    if (fechaEvento === fecha){
         evento.eventos.forEach((cita,index)=>{
             if ( (cita.horario + ":00") === (citaObtenida.horario+":00") && cita.id_paciente === citaObtenida.id_paciente) {
             evento.eventos.splice(index,1);     
             }

           
         });
         if (evento.eventos.length===0) {
          eventosArreglo.splice(eventosArreglo.indexOf(evento),1);
         }
     }
 });

 cargarDatosATabla();
 guardarCitas(eventosArreglo);

}