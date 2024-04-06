/*
Arreglo en el cual vamos a almacenar las citas registradas.*/
let eventosArreglo = obtenerCitas() || [];

//variables de interaccion con el html
const cuerpoTabla = document.querySelector(".cuerpoTabla");
const addEventoContainer = document.querySelector(".add-evento-contenedor");
const addEventoTitulo = document.querySelector(".add-evento-header");
const addEventoCuerpo = document.querySelector(".add-evento-input");

const addEventoCloseBtn = document.querySelector(".close");
const aceptarBtn = document.querySelector(".aceptar");
const rechazarBtn = document.querySelector(".rechazar");


//funcion para meter los datos a la tabla del arreglo a la tabla de aprobaciones
function cargarDatosATabla() {
  cuerpoTabla.innerHTML = "";
  let contenido = "";
  let medico = extraerSesionMedico();

  eventosArreglo.forEach((item) => {

    item.eventos.forEach(cita => {
      //validacion para que solo se muestren las citas del medico que ingresó y las citas pendientes
      if (cita.id_medico === medico.identificacion && cita.estado === "pendiente") {

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

//se llama a la funcion de cargar datos a la tabla.
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

        //accion modal
        let citaObtenida = null;
        //se busca la cista la cual escogió el medico para presentar el modal de opciones
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
        //se llama al modal de opciones
        crearModal(fecha, citaObtenida);



      });
    }
  });
}

document.addEventListener("click", (e) => {
  //si se da click fuera o en algun lugar que no sean los botones, se cierra el modal
  if (e.target !== aceptarBtn && e.target !== rechazarBtn && addEventoContainer.contains(e.target)) {
    addEventoContainer.classList.remove("activo");
  }
});



//la funcion la cual actualiza el modal a partir de los datos de la cita y hace que se presente
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
  //se deben poner los listeners de los botones acá ya que no recibe los listeners hasta que el componente no se esté mostrando
  aceptarBtn.addEventListener("click", () => {
    alert("cita aceptada");
    aceptarCita(fecha, citaObtenida);
    addEventoContainer.classList.remove("activo");
  });

  rechazarBtn.addEventListener("click", () => {
    alert("cita rechazada");
    rechazarCita(fecha, citaObtenida);
    addEventoContainer.classList.remove("activo");
  });

  //se agrega la clase al contedor que hace que se vuelva visible.
  addEventoContainer.classList.toggle("activo");

}


//funcion que acepta la cita y por ende cambia el estado de la cita a aceptada.
function aceptarCita(fecha, citaObtenida) {
  eventosArreglo.forEach((evento) => {
    let fechaEvento = evento.dia + "/" + evento.mes + "/" + evento.anio;
    if (fechaEvento === fecha) {

      evento.eventos.forEach((cita) => {
        if ((cita.horario + ":00") === (citaObtenida.horario + ":00") && cita.id_paciente === citaObtenida.id_paciente) {
          cita.estado = "Aceptada";
          let correo = obtenerCorreoPaciente(citaObtenida.id_paciente);

          //una vez aceptada la cita notifica al paciente mediante el correo con todos los detalles de la cita.
          enviarCorreo(correo, fecha, citaObtenida.horario);
        }
      });

    }
  });
  //actualiza la tabla para quitar la cita que ya aceptó el medico y de paso se guarda la actualizacion en el local storage.
  cargarDatosATabla();
  guardarCitas(eventosArreglo);
}


//funcion para rechazar las citas, se eliminan la cita que se desea rechazar del arreglo de citas. 
function rechazarCita(fecha, citaObtenida) {
  eventosArreglo.forEach((evento) => {
    let fechaEvento = evento.dia + "/" + evento.mes + "/" + evento.anio;
    if (fechaEvento === fecha) {
      evento.eventos.forEach((cita, index) => {
        if ((cita.horario + ":00") === (citaObtenida.horario + ":00") && cita.id_paciente === citaObtenida.id_paciente) {
          evento.eventos.splice(index, 1);
        }


      });
      //si el arreglo de citas de ese dia queda vacio, se elimina el arreglo
      if (evento.eventos.length === 0) {
        eventosArreglo.splice(eventosArreglo.indexOf(evento), 1);
      }
    }
  });
  //se actualiza la tabla con la cita eliminada y se actualiza el local storage
  cargarDatosATabla();
  guardarCitas(eventosArreglo);

}


//funciones correo
(function () {
  emailjs.init('4AfLe6P6nuHxSQ-Na');
})();


function enviarCorreo(correo, fecha, hora) {
  // ID de la plantilla de correo electrónico creada en EmailJS
  const templateId = 'template_jz30u5a';

  // Datos a rellenar en la plantilla del correo electrónico
  const emailParams = {
    to_name: correo,
    from_name: 'Clínica arbol de seda',
    message: 'El médico ha cofirmado tu cita.\n Este correo es un recordatorio de tu cita con el medico: ' + medico.nombreCompleto + '. \n La cual fue solicitada para la fecha: ' + fecha
      + '. \n Y la hora establecida fue: ' + hora + ':00, \n!Esperamos tenga un buen dia!'
  };

  // Enviar el correo electrónico
  emailjs.send('service_f0jg7s7', templateId, emailParams)
    .then(function (response) {
      console.log('Correo electrónico enviado correctamente:', response);
    }, function (error) {
      console.error('Error al enviar el correo electrónico:', error);
    });
}