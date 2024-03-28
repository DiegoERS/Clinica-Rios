//2 arreglos, uno contiene todos los datos json sin modificar y el otro es el modificable que se va 
//a usar para la tabla.
let arregloDatos = [];
let medicos = [];

//variables de interaccion con el html
const cuerpoTabla = document.querySelector(".cuerpoTabla");
const inputGeneral = document.querySelector(".Allselect");
const inputID = document.querySelector(".input-id");
const inputNombre = document.querySelector(".input-Nombre");
const inputEspecialidad = document.querySelector(".input-Especialidad");
const inputUbicacion = document.querySelector(".input-ubicacion");
const addEventoContainer = document.querySelector(".add-evento-contenedor");
const addEventoCloseBtn = document.querySelector(".close");

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

    // Mostrar los datos en la consola (opcional)
    console.log(arregloDatos);
    console.log(medicos);
    cargarDatosATabla();

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
  console.log("ed");
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

  cargarDatosATabla();

}

function cargarlistener(){
  const filas = document.querySelectorAll(".table tr");
   // Agregar evento de clic a cada fila
   filas.forEach(function(fila, indice) {
    // Ignorar la primera fila (encabezados)
    if (indice !== 0) {
      fila.addEventListener("click", function() {
        // Obtener los datos de la fila clicada
        const nombre = fila.cells[0].textContent;
        const edad = fila.cells[1].textContent;

        // Mostrar los datos en la consola (puedes hacer otra acción aquí)
        //accion modal
        addEventoContainer.classList.toggle("activo");
        console.log(addEventoContainer.classList);
      });
    }
  });
}

addEventoCloseBtn.addEventListener("click", () => {
  addEventoContainer.classList.remove("activo");
});

document.addEventListener("click", (e) => {
  //si se da click fuera
  if ( addEventoContainer.contains(e.target)) {
      addEventoContainer.classList.remove("activo");
  }
});