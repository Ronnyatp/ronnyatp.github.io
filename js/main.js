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
      vec2 mid = (screen
  