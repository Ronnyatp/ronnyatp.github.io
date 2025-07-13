document.getElementById('formulario').addEventListener('submit', function (e) {
    e.preventDefault();
    const mensaje = document.getElementById('mensaje');
    mensaje.classList.remove('hidden');
    this.reset();
  });