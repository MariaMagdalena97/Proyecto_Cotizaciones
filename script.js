// Referencias al formulario y elementos
const formulario = document.getElementById("formCotizacion");
const erroresDiv = document.getElementById("errores");
const listaCotizaciones = document.getElementById("listaCotizaciones");

// Arreglo para almacenar cotizaciones
let cotizaciones = [];

// Se agrega un escuchador de eventos. Detecta cuándo el usuario hace clic en "Solicitar cotización".
formulario.addEventListener("submit", function (e) {
  // Evita que se recargue la página
  e.preventDefault(); 

  // Limpia errores anteriores
  erroresDiv.innerHTML = "";

  // Obtiene valores del formulario (.trim se agrega para evitar errores por elementos vacios)
  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const estilo = document.getElementById("estilo").value;
  const comentario = document.getElementById("comentario").value.trim();
  // Obtiene todos los checkboxes marcados
  const checkboxes = document.querySelectorAll('input[name="servicio"]:checked');
  const servicios = Array.from(checkboxes).map(cb => cb.value);

  // Guarda los errores para revisar
  let errores = [];

  // Validaciones
  if (nombre.length < 2) {
    // Mensaje de error.
    errores.push("El nombre debe tener al menos 2 caracteres.");
  }
  
  // Que el email sea detectado como email
  if (!validarEmail(email)) {
    errores.push("El correo electrónico no es válido.");
  }

  if (servicios.length === 0) {
  errores.push("Debes seleccionar al menos un servicio.");
  }

  if (estilo === "") {
    errores.push("Debes seleccionar un estilo visual.");
  }

  // Si hay errores, se muestran como error y se detiene la ejecución del formulario
  if (errores.length > 0) {
    erroresDiv.innerHTML = errores.map(err => `<div>${err}</div>`).join("");
    return;
  }

  // Crea objeto de cotización
  const cotizacion = {
    nombre,
    email,
    servicios,
    estilo,
    comentario
  };

  // Agrega al arreglo en la ágina
  cotizaciones.push(cotizacion);

  // Muestra las cotizaciones en pantalla
  mostrarCotizaciones();

  // Limpia el formulario
  formulario.reset();
}); // fin del preventDefault

// Función para validar formato de correo electrónico
function validarEmail(email) {
  const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return regex.test(email);
}

// Función para mostrar las cotizaciones en el DOM
function mostrarCotizaciones() {
  const div = listaCotizaciones;
  div.innerHTML = `<h2>Cotizaciones registradas</h2>`;
  
  // Recorre todas las cotizaciones guardadas, crea un div por cada una, 
  // muestra su información con HTML y las inserta en el DOM usando appendChild
  cotizaciones.forEach((cot) => {
    const card = document.createElement("div");
    card.className = "cotizacion";
    card.innerHTML = `
      <h3>Servicios: ${cot.servicios.join(", ")}</h3>
      <p><strong>Cliente:</strong> ${cot.nombre}</p>
      <p><strong>Email:</strong> ${cot.email}</p>
      <p><strong>Estilo:</strong> ${cot.estilo}</p>
      <p><strong>Comentario:</strong> ${cot.comentario || "—"}</p>
    `;
    div.appendChild(card);
  });
}

