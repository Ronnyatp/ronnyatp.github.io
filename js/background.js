// js/background.js

const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = canvas.height + Math.random() * 100;
    this.size = Math.random() * 2 + 1;
    this.speedY = Math.random() * 1 + 0.5;
    this.alpha = Math.random();
  }

  update() {
    this.y -= this.speedY;
    if (this.y < -this.size) {
      this.reset();
    }
  }

  draw() {
    ctx.fillStyle = `rgba(255, 150, 0, ${this.alpha})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const particles = Array.from({ length: 100 }, () => new Particle());

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let particle of particles) {
    particle.update();
    particle.draw();
  }
  requestAnimationFrame(animate);
}

animate();
