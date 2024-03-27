let arregloDatos = [];

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

    // Mostrar los datos en la consola (opcional)
    console.log(arregloDatos);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Llamar a la función para cargar y procesar el archivo JSON
cargarJSON();