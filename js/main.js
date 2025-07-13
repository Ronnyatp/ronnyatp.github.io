// --- FORMULARIO ---
document.getElementById('formulario').addEventListener('submit', function (e) {
    e.preventDefault();
    const mensaje = document.getElementById('mensaje');
    mensaje.classList.remove('hidden');
    this.reset();
  });
  
  // --- SHADER BALATRO STYLE ---
  
  const balatroShader = `
  
  #define SPIN_ROTATION -2.0
  #define SPIN_SPEED 7.0
  #define OFFSET vec2(0.0)
  #define COLOUR_1 vec4(0.871, 0.267, 0.231, 1.0)
  #define COLOUR_2 vec4(0.0, 0.42, 0.706, 1.0)
  #define COLOUR_3 vec4(0.086, 0.137, 0.145, 1.0)
  #define CONTRAST 3.5
  #define LIGTHING 0.4
  #define SPIN_AMOUNT 0.25
  #define PIXEL_FILTER 745.0
  #define SPIN_EASE 1.0
  #define PI 3.14159265359
  #define IS_ROTATE false
  
  precision mediump float;
  uniform float iTime;
  uniform vec2 iResolution;
  
  vec4 effect(vec2 screenSize, vec2 screen_coords) {
      float pixel_size = length(screenSize.xy) / PIXEL_FILTER;
      vec2 uv = (floor(screen_coords.xy*(1./pixel_size))*pixel_size - 0.5*screenSize.xy)/length(screenSize.xy) - OFFSET;
      float uv_len = length(uv);
  
      float speed = (SPIN_ROTATION*SPIN_EASE*0.2);
      if(IS_ROTATE){
         speed = iTime * speed;
      }
      speed += 302.2;
      float new_pixel_angle = atan(uv.y, uv.x) + speed - SPIN_EASE*20.*(1.*SPIN_AMOUNT*uv_len + (1. - 1.*SPIN_AMOUNT));
      vec2 mid = (screenSize.xy/length(screenSize.xy))/2.;
      uv = (vec2((uv_len * cos(new_pixel_angle) + mid.x), (uv_len * sin(new_pixel_angle) + mid.y)) - mid);
  
      uv *= 30.;
      speed = iTime*(SPIN_SPEED);
      vec2 uv2 = vec2(uv.x+uv.y);
  
      for(int i=0; i < 5; i++) {
          uv2 += sin(max(uv.x, uv.y)) + uv;
          uv  += 0.5*vec2(cos(5.1123314 + 0.353*uv2.y + speed*0.131121),sin(uv2.x - 0.113*speed));
          uv  -= 1.0*cos(uv.x + uv.y) - 1.0*sin(uv.x*0.711 - uv.y);
      }
  
      float contrast_mod = (0.25*CONTRAST + 0.5*SPIN_AMOUNT + 1.2);
      float paint_res = min(2., max(0.,length(uv)*(0.035)*contrast_mod));
      float c1p = max(0.,1. - contrast_mod*abs(1.-paint_res));
      float c2p = max(0.,1. - contrast_mod*abs(paint_res));
      float c3p = 1. - min(1., c1p + c2p);
      float light = (LIGTHING - 0.2)*max(c1p*5. - 4., 0.) + LIGTHING*max(c2p*5. - 4., 0.);
      return (0.3/CONTRAST)*COLOUR_1 + (1. - 0.3/CONTRAST)*(COLOUR_1*c1p + COLOUR_2*c2p + vec4(c3p*COLOUR_3.rgb, c3p*COLOUR_1.a)) + light;
  }
  
  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
      vec2 uv = fragCoord/iResolution.xy;
      fragColor = effect(iResolution.xy, uv * iResolution.xy);
  }
  
  void main() {
      vec4 color;
      mainImage(color, gl_FragCoord.xy);
      gl_FragColor = color;
  }
  `;
  
  function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error("Shader compile error:", gl.getShaderInfoLog(shader));
      return null;
    }
  
    return shader;
  }
  
  function startBalatroShader() {
    const canvas = document.createElement("canvas");
    canvas.id = "shader-bg";
    document.body.appendChild(canvas);
  
    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL no soportado");
      return;
    }
  
    const vertexSource = `
      attribute vec4 position;
      void main() {
        gl_Position = position;
      }
    `;
  
    const vs = createShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fs = createShader(gl, gl.FRAGMENT_SHADER, balatroShader);
  
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);
  
    const vertices = new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1
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
      let now = (Date.now() - start) / 1000;
      gl.uniform1f(iTimeLoc, now);
      gl.uniform2f(iResolutionLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    }
  
    render();
  }
  
  startBalatroShader();
  