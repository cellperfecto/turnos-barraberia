// Lista de turnos. Se guarda en el navegador para que no se pierda al recargar.
var CLAVE = "turnos-barraberia";
var turnos = [];

function guardar() {
  localStorage.setItem(CLAVE, JSON.stringify(turnos));
}

function cargar() {
  try {
    var guardados = localStorage.getItem(CLAVE);
    var datos = guardados ? JSON.parse(guardados) : [];
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    return [];
  }
}

turnos = cargar();

var formulario = document.getElementById("formulario");
var nombre = document.getElementById("nombre");
var dia = document.getElementById("dia");
var hora = document.getElementById("hora");
var aviso = document.getElementById("aviso");
var contador = document.getElementById("contador");
var lista = document.getElementById("lista");

// Pasa "2026-11-20" a "20/11/2026" para mostrarlo en pantalla.
function formatearDia(texto) {
  var partes = texto.split("-");
  if (partes.length !== 3) return texto;
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function mostrarAviso(texto) {
  aviso.textContent = texto;
}

function dibujar() {
  lista.innerHTML = "";

  // Ordenamos por día y hora, de lo más próximo a lo más lejano.
  turnos.sort(function (a, b) {
    var claveA = a.dia + " " + a.hora;
    var claveB = b.dia + " " + b.hora;
    if (claveA < claveB) return -1;
    if (claveA > claveB) return 1;
    return 0;
  });

  if (turnos.length === 0) {
    var vacio = document.createElement("li");
    vacio.className = "vacio";
    vacio.textContent = "Todavía no hay turnos reservados.";
    lista.appendChild(vacio);
  }

  turnos.forEach(function (turno, indice) {
    var fila = document.createElement("li");
    fila.className = "turno";

    var datos = document.createElement("div");
    datos.className = "datos";

    var cliente = document.createElement("span");
    cliente.className = "cliente";
    cliente.textContent = turno.nombre;

    var cuando = document.createElement("span");
    cuando.className = "cuando";
    cuando.textContent = formatearDia(turno.dia) + " a las " + turno.hora + " hs";

    datos.appendChild(cliente);
    datos.appendChild(cuando);

    var boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = "Cancelar";
    boton.addEventListener("click", function () {
      turnos.splice(indice, 1);
      guardar();
      mostrarAviso("");
      dibujar();
    });

    fila.appendChild(datos);
    fila.appendChild(boton);
    lista.appendChild(fila);
  });

  contador.textContent = "Turnos reservados: " + turnos.length;
}

formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  var clienteEscrito = nombre.value.trim();

  if (clienteEscrito === "") {
    mostrarAviso("Falta el nombre del cliente.");
    nombre.focus();
    return;
  }

  if (dia.value === "" || hora.value === "") {
    mostrarAviso("Falta el día o la hora del turno.");
    return;
  }

  var ocupado = turnos.some(function (turno) {
    return turno.dia === dia.value && turno.hora === hora.value;
  });

  if (ocupado) {
    mostrarAviso("Ese horario ya está ocupado. Elegí otro día u hora.");
    return;
  }

  turnos.push({
    nombre: clienteEscrito,
    dia: dia.value,
    hora: hora.value
  });

  guardar();
  formulario.reset();
  mostrarAviso("");
  nombre.focus();
  dibujar();
});

dibujar();
