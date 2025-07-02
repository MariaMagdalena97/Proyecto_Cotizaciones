// Referencias al formulario y elementos
const formulario = document.getElementById("formCotizacion");
const erroresDiv = document.getElementById("errores");
const listaCotizaciones = document.getElementById("listaCotizaciones");

// Arreglo para almacenar cotizaciones
let cotizaciones = [];

// Escuchar el envío del formulario
formulario.addEventListener("submit", function (e) {
  e.preventDefault(); 
  erroresDiv.innerHTML = "";

  // Obtener datos del formulario
  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const estilo = document.getElementById("estilo").value;
  const comentario = document.getElementById("comentario").value.trim();
  const servicios = obtenerServiciosSeleccionados();

  // Validar y manejar errores
  const errores = validarFormulario(nombre, email, servicios, estilo, comentario);
  if (errores.length > 0) {
    mostrarErrores(errores);
    return;
  }

  // Crear objeto de cotización
  const cotizacion = {
    nombre,
    email,
    servicios,
    estilo,
    comentario
  };

  // Guardar y mostrar
  cotizaciones.push(cotizacion);
  localStorage.setItem("cotizaciones", JSON.stringify(cotizaciones));
  mostrarCotizaciones();
  mostrarMensajeExito();
  limpiarFormulario();
});

// Función para validar el formulario
function validarFormulario(nombre, email, servicios, estilo, comentario) {
  let errores = [];

  if (nombre.length < 2) {
    errores.push("El nombre debe tener al menos 2 caracteres.");
  }

  if (!validarEmail(email)) {
    errores.push("El correo electrónico no es válido.");
  }

  if (servicios.length === 0) {
    errores.push("Debes seleccionar al menos un servicio.");
  }

  if (estilo === "") {
    errores.push("Debes seleccionar un estilo visual.");
  }

  const caracteresInvalidos = /[<>/]/;
  if (caracteresInvalidos.test(comentario)) {
    errores.push("El comentario no debe contener los símbolos <, > o /");
  }

  return errores;
}

// Función para mostrar errores en el DOM
function mostrarErrores(errores) {
  erroresDiv.innerHTML = errores.map(err => `<div>${err}</div>`).join("");
}

// Función para mostrar mensaje de éxito
function mostrarMensajeExito() {
  const exitoDiv = document.createElement("div");
  exitoDiv.className = "exito";
  exitoDiv.innerText = "¡Cotización enviada con éxito!";
  formulario.insertAdjacentElement("beforebegin", exitoDiv);
  setTimeout(() => exitoDiv.remove(), 4000);
}

// Función para limpiar el formulario
function limpiarFormulario() {
  formulario.reset();
}

// Validación básica de formato de email
function validarEmail(email) {
  const regex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  return regex.test(email);
}

// Obtener servicios seleccionados (checkbox)
function obtenerServiciosSeleccionados() {
  const checkboxes = document.querySelectorAll('input[name="servicio"]:checked');
  return Array.from(checkboxes).map(cb => cb.value);
}

// Mostrar cotizaciones guardadas en el DOM
function mostrarCotizaciones() {
  const div = listaCotizaciones;
  div.innerHTML = `<h2>Cotizaciones registradas</h2>`;

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

// Al cargar la página, mostrar cotizaciones guardadas
window.addEventListener("DOMContentLoaded", () => {
  const datosGuardados = localStorage.getItem("cotizaciones");
  if (datosGuardados) {
    cotizaciones = JSON.parse(datosGuardados);
    mostrarCotizaciones();
  }
});



