import { db } from './firebase-config.js';
import { ref, push } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

document.getElementById("formulario").addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const contacto = document.getElementById("contacto").value.trim();

  if (!nombre || !contacto) {
    alert("Por favor completa todos los campos de asistencia");
    return;
  }

  push(ref(db, "asistentes/"), { nombre, contacto })
    .then(() => {
      document.getElementById("mensaje").classList.remove("hidden");
      e.target.reset();
    });
});

document.getElementById("form-parqueo").addEventListener("submit", (e) => {
  e.preventDefault();
  const placa = document.getElementById("placa").value.trim();
  const vehiculo = document.getElementById("vehiculo").value;

  if (!placa || !vehiculo) {
    alert("Por favor completa todos los campos de parqueo");
    return;
  }

  push(ref(db, "parqueadero/"), { placa, vehiculo })
    .then(() => {
      alert("Reserva de parqueadero confirmada 🚗");
      e.target.reset();
    });
});
