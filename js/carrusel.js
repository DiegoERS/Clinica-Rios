//funcion para mover las imagenes a la izquierda mediante la flecha
document.getElementById("boton_izquierda").onclick = function() {
 console.log("hola mundo");
    var scrollDeCarrusel = document.getElementById("carruseljs");

    scrollDeCarrusel.scrollTo({
        left: scrollDeCarrusel.scrollLeft - 200, 
        behavior: 'smooth' // Desplazamiento suave
    });
};

//funcion para mover las imagenes a la derecha mediante la flecha
document.getElementById("boton_derecha").onclick = function() {
    console.log("hola mundo2");
    var scrollDeCarrusel = document.getElementById("carruseljs");

    scrollDeCarrusel.scrollTo({
        left: scrollDeCarrusel.scrollLeft + 200, 
        behavior: 'smooth' // Desplazamiento suave
    });
};