"use strict";

window.app = {
  gl: null,
  canvas: null,
  geometry: {
    points: [vec2(-1, -1), vec2(1, -1), vec2(1, 1), vec2(-1, 1)],
  },

  init: function init() {
    var canvas = document.getElementById('gl-canvas');
    var gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
      alert("WebGL isn't available");
    }

    this.canvas = canvas;
    this.gl = gl;

    //
    // Configure WebGL
    //
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);

    // Associate our shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    // Attach event observers.
    canvas.addEventListener('mousemove', window.app.handleMouseMove);

    this.redraw();
  },  

  redraw: function redraw() {
    this.render();
  },

  render: function render() {
    var gl = this.gl;
    var points = this.geometry.points;

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES, 0, points.length);
  },

  /*
      Handle changes to input elements.
  */
  handleMouseMove: function handleMouseMove(event) {
    var app = window.app;
    var canvas = app.canvas;
    var width = canvas.width;
    var height = canvas.height;
    var glX = -1 + (2 * event.offsetX / width);
    var glY = -1 + (2 * (height - event.offsetY)) / height;
    console.log(glX, glY);
  },
};

window.onload = function init()
{
  window.app.init();
};
