let eventosArreglo=obtenerCitas() || [];

//variables de interaccion con el html
const cuerpoTabla = document.querySelector(".cuerpoTabla");
const addEventoContainer = document.querySelector(".add-evento-contenedor");
const addEventoTitulo=document.querySelector(".add-evento-header");
const addEventoCuerpo=document.querySelector(".add-evento-input");


//funcion para meter los datos a la tabla
function cargarDatosATabla() {
    cuerpoTabla.innerHTML = "";
    let contenido = "";
  
    eventosArreglo.forEach((item) => {
     
     item.eventos.forEach(cita => {
        if (cita.estado==="pendiente") {
            contenido += ` <tr class="fila">
            <th>${item.dia+"/"+ item.mes +"/"+ item.anio}</th>
            <th>${cita.horario +":00"}</th>
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


  function cargarlistener(){
    const filas = document.querySelectorAll(".table tr");
     // Agregar evento de clic a cada fila
     filas.forEach(function(fila, indice) {
      // Ignorar la primera fila (encabezados)
      if (indice !== 0) {
        fila.addEventListener("click", function() {
          // Obtener los datos de la fila clicada
          let id = fila.cells[0].textContent;
        
  
          // Mostrar los datos en la consola (puedes hacer otra acción aquí)
          //accion modal
  
          //let medico=arregloDatos.find(medico => medico.identificacion === id);
          crearModal();

          
          
        });
      }
    });
  }

  document.addEventListener("click", (e) => {
    //si se da click fuera
    if ( addEventoContainer.contains(e.target)) {
        addEventoContainer.classList.remove("activo");
    }
  });
  
  
  function crearModal(){
    let titulo=` <div class="titulo">${"Solicitud de cita"}</div>
    <i class="fas fa-times close"></i>`;
  
    addEventoTitulo.innerHTML=titulo;
  
    const addEventoCloseBtn = document.querySelector(".close");
    addEventoCloseBtn.addEventListener("click", () => {
      addEventoContainer.classList.remove("activo");
    });
  
    let informacion=`<p>${"Acá van los botones"}</p>`;
  
    
  
  
    addEventoCuerpo.innerHTML=informacion;
  
  
    addEventoContainer.classList.toggle("activo");
  
  }