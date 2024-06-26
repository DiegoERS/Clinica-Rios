//2 arreglos, uno contiene todos los datos json sin modificar y el otro es el modificable que se va 
//a usar para la tabla.
let arregloDatos = [];
let medicos = [];
let datosPaginacion=[];

//variables de interaccion con el html
const cuerpoTabla = document.querySelector(".cuerpoTabla");
const inputGeneral = document.querySelector(".Allselect");
const inputID = document.querySelector(".input-id");
const inputNombre = document.querySelector(".input-Nombre");
const inputEspecialidad = document.querySelector(".input-Especialidad");
const inputUbicacion = document.querySelector(".input-ubicacion");
const addEventoContainer = document.querySelector(".add-evento-contenedor");


const addEventoTitulo=document.querySelector(".add-evento-header");
const addEventoCuerpo=document.querySelector(".add-evento-input");
const previousPage=document.querySelector(".fa-chevron-left");
const nextPage=document.querySelector(".fa-chevron-right");

//variables de paginacion
let limite=4;
let desde=0;
let paginas= medicos.length/limite;
let paginaActiva=1;


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
    arregloDatos = datos;
    medicos = datos;
    datosPaginacion=datos;

    // Mostrar los datos en la consola (opcional)
    console.log(arregloDatos);
    console.log(medicos);
    paginacion();


  } catch (error) {
    console.error('Error:', error);
  }
}

// Llamar a la función para cargar y procesar el archivo JSON
cargarJSON();




//funcion para meter los datos a la tabla
function cargarDatosATabla() {
  cuerpoTabla.innerHTML = "";
  let contenido = "";

  medicos.forEach((medico) => {
    contenido += ` <tr class="fila">
     <th>${medico.identificacion}</th>
     <td>${medico.nombreCompleto}</td>
     <td>${medico.especialidad}</td>
     <td>${medico.ubicacionConsulta}</td>
   </tr>`;
  });

  cuerpoTabla.innerHTML = contenido;
  cargarlistener();
}

//funciones paraautocompletado y filtrado

inputID.addEventListener("input", (e) => {
  
  inputID.value = inputID.value.replace(/[^0-9-]/g, "");
  if (inputID.value.length === 2) {
    inputID.value += "-";
  }

  if (inputID.value.length === 7) {
    inputID.value += "-";
  }

  if (inputID.value.length > 12) {
    inputID.value = inputID.value.slice(0, 12);
  }


  if (e.inputType === "deleteContentBackward") {
    if (inputID.value.length === 3) {
      inputID.value = inputID.value.slice(0, 2);
    }

    if (inputID.value.length === 8) {
      inputID.value = inputID.value.slice(0, 7);
    }

  }

  filtracionCompleta();
});

inputNombre.addEventListener("input", () => {
  inputNombre.value = inputNombre.value.replace(/[^a-zA-Z ]/g, '');
  filtracionCompleta();
});

inputEspecialidad.addEventListener("input", () => {
  inputEspecialidad.value = inputEspecialidad.value.replace(/[^a-zA-Z ]/g, '');
  filtracionCompleta();
});

inputUbicacion.addEventListener("input", () => {
  filtracionCompleta();
});

inputGeneral.addEventListener("input", () => {
  filtracionCompleta();
});

//funcion que hace el filtro completo, toma en cuenta todos los inputs que son filtros y deja el arreglo que se debe despues de pasar
// por todos los filtros.
function filtracionCompleta() {
  medicos = arregloDatos;

  if (inputGeneral.value !== "") {
    medicos = medicos.filter(dato => dato.nombreCompleto.toLowerCase().includes(inputGeneral.value.toLowerCase()) ||
      dato.identificacion.toLowerCase().includes(inputGeneral.value.toLowerCase()) ||
      dato.especialidad.toLowerCase().includes(inputGeneral.value.toLowerCase()) ||
      dato.ubicacionConsulta.toLowerCase().includes(inputGeneral.value.toLowerCase()));
  }

  if (inputNombre.value !== "") {
    medicos = medicos.filter(dato => dato.nombreCompleto.toLowerCase().includes(inputNombre.value.toLowerCase()));
  }
  if (inputID.value !== "") {
    medicos = medicos.filter(dato => dato.identificacion.includes(inputID.value));
  }
  if (inputEspecialidad.value !== "") {
    medicos = medicos.filter(dato => dato.especialidad.toLowerCase().includes(inputEspecialidad.value.toLowerCase()));
  }

  if (inputUbicacion.value !== "") {
    medicos = medicos.filter(dato => dato.ubicacionConsulta.toLowerCase().includes(inputUbicacion.value.toLowerCase()));
  }

  datosPaginacion=medicos;
  paginaActiva=1;
  desde=0;

  paginacion();

}

//carga los listeners de cada fila para la funcion del modal.
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

        let medico=arregloDatos.find(medico => medico.identificacion === id);
        crearModal(medico);
        
        
      });
    }
  });
}




document.addEventListener("click", (e) => {
  //si se da click fuera del modal
  if ( addEventoContainer.contains(e.target)) {
      addEventoContainer.classList.remove("activo");
  }
});


//funcion que crea el modal segun los datos del medico
function crearModal(medico){
  let titulo=` <div class="titulo">${medico.nombreCompleto}</div>
  <i class="fas fa-times close"></i>`;

  addEventoTitulo.innerHTML=titulo;

  const addEventoCloseBtn = document.querySelector(".close");
  addEventoCloseBtn.addEventListener("click", () => {
    addEventoContainer.classList.remove("activo");
  });

  let informacion=`<p>${"Biografía: "+ medico.biografia}</p>
                  <p>${"Identificación: "+ medico.identificacion}</p>
                  <p>${"Especialidad médica: "+ medico.especialidad}</p>
                  <p>${"Ubicación: "+ medico.ubicacionConsulta}</p>
                  <p>${"Reseñas y calificaciones: "}</p>`;

  medico.reseñasCalificaciones.forEach(resenia => {
    informacion+=`<div class="reseña"><p>${"Nombre del paciente: "+ resenia.nombrePaciente}</p>
    <p>${"Calificación: "+ resenia.calificacion}</p>
    <p>${"Reseña: "+ resenia.resena}</p></div>`;
  });
  


  addEventoCuerpo.innerHTML=informacion;


  addEventoContainer.classList.toggle("activo");

}


//funcion que hace el recorte del arreglo filtrado y lo carga a la tabla
function paginacion() {
  medicos=datosPaginacion.slice(desde,limite*paginaActiva);
  cargarDatosATabla();
}

//listeners para los cambios de pagina 
previousPage.addEventListener("click",()=>{
  paginas= datosPaginacion.length/limite;
  if(desde>0){
    desde-=4;
    paginaActiva--;
    paginacion();
    //cargar los datos
  }
});

nextPage.addEventListener("click",()=>{
  paginas= datosPaginacion.length/limite;
  if(paginaActiva< paginas){
    desde+=4;
    paginaActiva++;
    //cargar los datos
    paginacion();
  }
});

  // Función para ordenar por propiedad
  function ordenarArreglo(propiedad) {
    return function(a, b) {
        if (a[propiedad] > b[propiedad]) {
            return 1;
        } else if (a[propiedad] < b[propiedad]) {
            return -1;
        } else {
            return 0;
        }
    };
}

//listener para detectar el cambio al select de orden
document.getElementById('ordenamiento').addEventListener('change', function() {
  var propiedad = this.value;
  if (propiedad=== "") {
    return;
  }
  console.log(propiedad);
  datosPaginacion=datosPaginacion.sort(ordenarArreglo(propiedad));
  paginacion();
});

