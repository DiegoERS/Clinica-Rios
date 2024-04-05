
let listaMedicos = [];
//FUNCTIONS
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

    listaMedicos = datos;

    console.log(listaMedicos);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Llamar a la función para cargar y procesar el archivo JSON
cargarJSON();

function guardarStorage(pacientes) {
  const arregloString = JSON.stringify(pacientes);
  localStorage.setItem('pacientesGuardados', arregloString);
}

function extraerStorage() {
  let arregloStringRecuperado = localStorage.getItem('pacientesGuardados');
  pacientes = JSON.parse(arregloStringRecuperado);
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


function cambiarContraseniaPaciente(pacientecambio) {
  let pacientesObtenidos = extraerStorage() || [];
  let hecho=false;
  pacientesObtenidos.forEach(paciente => {

    if (paciente.cedula === pacientecambio[0].cedula && paciente.correo.toLowerCase() === pacientecambio[0].correo.toLowerCase()
      && paciente.celular === pacientecambio[0].celular) {
      paciente.contrasenia = pacientecambio[0].contrasenia;
      guardarStorage(pacientesObtenidos);
      hecho= true;
    }

  });



  return hecho;
}



function buscarPacientePorCedulaYContraseña(cedulaBuscada, contraseniaBuscada) {
  let pacientes = extraerStorage();
  let medico = iniciarSesionMedico(cedulaBuscada, contraseniaBuscada);
  if (medico) {
    guardarSesionMedico(medico);
    window.location.href = 'aprobaciónCitas.html';
    alert("medico autenticado");
    return null;
  }
  let pacienteEncontrado = pacientes.find(pacientes => pacientes.cedula === cedulaBuscada);
  if (pacienteEncontrado && pacienteEncontrado.contrasenia === contraseniaBuscada) {
    return pacienteEncontrado;
  } else {
    alert("contraseña incorrecta");
    return null;
  }
}

function iniciarSesionMedico(cedulaBuscada, contraseniaBuscada) {
  let medicoEncontrado = listaMedicos.find(listaMedicos => listaMedicos.identificacion === cedulaBuscada);
  if (medicoEncontrado && medicoEncontrado.contrasenia === contraseniaBuscada) {
    return medicoEncontrado;
  }
  return null;
}

function guardarSesionMedico(medico) {
  const arregloMedico = JSON.stringify(medico);
  localStorage.setItem('MedicoGuardado', arregloMedico);
}

function extraerSesionMedico() {
  let arregloStringRecuperado = localStorage.getItem('MedicoGuardado');
  medico = JSON.parse(arregloStringRecuperado);
  return medico;
}


function guardarStorageCitas(citas) {
  const arregloCitas = JSON.stringify(citas);
  localStorage.setItem('citas', arregloCitas);
}

function extraerStorageCitas() {
  let arregloStringRecuperado = localStorage.getItem('citas');
  citas = JSON.parse(arregloStringRecuperado);
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
function guardarCitas(eventosArreglo) {
  localStorage.setItem("citas", JSON.stringify(eventosArreglo));
}

function obtenerCitas() {
  let arregloStringRecuperado = localStorage.getItem('citas');
  let cita = JSON.parse(arregloStringRecuperado);

  return cita;
}

// Función para realizar la encriptación MD5
function encriptarMD5(cadena) {
  let mensaje = cadena;

  // Función auxiliar para rotar bits a la izquierda
  function rotl(n, s) {
    return (n << s) | (n >>> (32 - s));
  }

  // Variables iniciales para el algoritmo MD5
  let A = 0x67452301;
  let B = 0xefcdab89;
  let C = 0x98badcfe;
  let D = 0x10325476;

  // Funciones auxiliares para el algoritmo MD5
  function F(X, Y, Z) {
    return (X & Y) | (~X & Z);
  }
  function G(X, Y, Z) {
    return (X & Z) | (Y & ~Z);
  }
  function H(X, Y, Z) {
    return X ^ Y ^ Z;
  }
  function I(X, Y, Z) {
    return Y ^ (X | ~Z);
  }

  // Función auxiliar para procesar un bloque de 512 bits
  function procesarBloque(m, offset) {
    let words = [];
    for (let i = 0; i < 16; i++) {
      words[i] = m[offset + i] | 0;
    }

    let [a, b, c, d] = [A, B, C, D];

    for (let i = 0; i < 64; i++) {
      let f, g;
      if (i < 16) {
        f = F(b, c, d);
        g = i;
      } else if (i < 32) {
        f = G(b, c, d);
        g = (5 * i + 1) % 16;
      } else if (i < 48) {
        f = H(b, c, d);
        g = (3 * i + 5) % 16;
      } else {
        f = I(b, c, d);
        g = (7 * i) % 16;
      }

      let temp = d;
      d = c;
      c = b;
      b = b + rotl(a + f + words[g] + K[i], S[i]);
      a = temp;
    }

    A += a;
    B += b;
    C += c;
    D += d;
  }

  // Convierte la cadena de entrada en un arreglo de palabras (512 bits)
  let longitud = mensaje.length;
  let mensajeBits = [];
  for (let i = 0; i < longitud * 8; i += 8) {
    mensajeBits[i >> 5] |= (mensaje.charCodeAt(i / 8) & 0xff) << (i % 32);
  }
  mensajeBits[longitud >> 5] |= 0x80 << (longitud % 32);
  mensajeBits[((longitud + 64 >> 9) << 4) + 14] = longitud * 8;

  // Constantes para el algoritmo MD5
  const S = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22];
  const K = new Uint32Array([
    0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee,
    0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
    0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be,
    0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
    0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa,
    0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
    0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed,
    0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
    0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c,
    0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
    0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05,
    0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
    0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039,
    0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
    0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1,
    0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
  ]);

  // Procesa cada bloque de 512 bits
  for (let i = 0; i < mensajeBits.length; i += 16) {
    procesarBloque(mensajeBits, i);
  }

  // Formatea el hash MD5 resultante
  let hash = [A, B, C, D].map(num => {
    return ((num < 0) ? (num + 0x100000000) : num) // Convierte números negativos a positivos
      .toString(16).padStart(8, '0'); // Convierte a hexadecimal y completa con ceros a la izquierda
  }).join('');

  return hash;
}