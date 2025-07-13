function initCanvasBackground() {
    const canvas = document.createElement("canvas");
    canvas.id = "shader-bg";
    document.body.appendChild(canvas);
  
    const gl = canvas.getContext("webgl");
    if (!gl) return;
  
    const vertexShaderSrc = `
      attribute vec4 position;
      void main() {
        gl_Position = position;
      }
    `;
  
    const fragmentShaderSrc = `
      precision mediump float;
      uniform float iTime;
      uniform vec2 iResolution;
  
      void main() {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        vec3 col = 0.5 + 0.5*cos(iTime + uv.xyx + vec3(0,2,4));
        gl_FragColor = vec4(col, 1.0);
      }
    `;
  
    const vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, vertexShaderSrc);
    gl.compileShader(vs);
  
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, fragmentShaderSrc);
    gl.compileShader(fs);
  
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);
  
    const vertices = new Float32Array([
      -1, -1,  1, -1,  -1, 1,
      -1, 1,   1, -1,   1, 1
    ]);
  
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  
    const posLoc = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
  
    const timeLoc = gl.getUniformLocation(prog, "iTime");
    const resLoc = gl.getUniformLocation(prog, "iResolution");
  
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  
    window.addEventListener("resize", resize);
    resize();
  
    let start = Date.now();
    function render() {
      const t = (Date.now() - start) / 1000;
      gl.uniform1f(timeLoc, t);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    }
  
    render();
  }
  
  initCanvasBackground();
  