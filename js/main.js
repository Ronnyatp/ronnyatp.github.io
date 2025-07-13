// --- Formulario básico ---
document.getElementById('formulario').addEventListener('submit', function (e) {
    e.preventDefault();
    const mensaje = document.getElementById('mensaje');
    mensaje.classList.remove('hidden');
    this.reset();
  });
  
  // --- Fondo animado tipo Shadertoy ---
  const fragmentShader = `
  precision mediump float;
  uniform float iTime;
  uniform vec2 iResolution;
  
  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = fragCoord / iResolution.xy;
    vec2 pos = uv - 0.5;
    pos.x *= iResolution.x / iResolution.y;
  
    float len = length(pos);
    float angle = atan(pos.y, pos.x);
    float wave = sin(10.0 * len - iTime * 2.0 + angle * 4.0);
  
    vec3 color = vec3(0.2 + 0.5 * sin(iTime + len * 5.0),
                      0.2 + 0.5 * sin(iTime + len * 5.0 + 2.0),
                      0.6 + 0.4 * sin(iTime + len * 5.0 + 4.0));
  
    fragColor = vec4(color * wave, 1.0);
  }
  
  void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
  }
  `;
  
  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  }
  
  function initShaderCanvas() {
    const canvas = document.createElement("canvas");
    canvas.id = "shader-bg";
    document.body.appendChild(canvas);
  
    const gl = canvas.getContext("webgl");
    if (!gl) return;
  
    const vsSource = `
      attribute vec4 position;
      void main() {
        gl_Position = position;
      }
    `;
  
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShaderObj = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
  
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShaderObj);
    gl.linkProgram(program);
    gl.useProgram(program);
  
    const vertices = new Float32Array([
      -1, -1,
      1, -1,
      -1, 1,
      -1, 1,
      1, -1,
      1, 1
    ]);
  
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  
    const posLoc = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
  
    const iTimeLoc = gl.getUniformLocation(program, "iTime");
    const iResolutionLoc = gl.getUniformLocation(program, "iResolution");
  
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  
    window.addEventListener("resize", resize);
    resize();
  
    let start = Date.now();
    function render() {
      let now = (Date.now() - start) * 0.001;
      gl.uniform1f(iTimeLoc, now);
      gl.uniform2f(iResolutionLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    }
  
    render();
  }
  
  initShaderCanvas();
  