"use strict";

window.app = {
  gl: null,
  canvas: null,
  geometry: {
    points: [],
    maxPoints: 3,
    polygonRadius: 1,
    numSubdivisions: 5,
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

    // Associate out shader variables with our data buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    this.createPolygon();
    this.render();
  },  

  createPolygon: function createPolygon() {
    var points = this.geometry.points;
    var radius = this.geometry.polygonRadius;
    var maxPoints = this.geometry.maxPoints;
    var angleStep = 2 * Math.PI / maxPoints;
    var i, angle;

    // Clear current points.
    points.splice(0, points.length);

    for (i = 0; i <= maxPoints; i++) {
      points.push(vec2(0, 0));
      angle = i * angleStep;
      points.push(vec2(radius * Math.cos(angle), radius * Math.sin(angle)));
      angle = (i + 1) * angleStep;
      points.push(vec2(radius * Math.cos(angle), radius * Math.sin(angle)));
    }
  },

  render: function render() {
    var gl = this.gl;
    var points = this.geometry.points;

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, points.length);
  },
};

window.onload = function init()
{
  window.app.init();
};

