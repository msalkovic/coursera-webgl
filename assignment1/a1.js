"use strict";

window.app = {
  gl: null,
  canvas: null,
  geometry: {
    vertices: [],
    numVertices: 3,
    polygonRadius: 1,
    numSubdivisions: 3,
    points: [],
    twistAngle: 0,
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

    this.createPolygon();
    this.tessellatePolygon();
    this.twistPolygon(Math.PI / 3);
    this.render();
  },  

  createPolygon: function createPolygon() {
    var vertices = this.geometry.vertices;
    var radius = this.geometry.polygonRadius;
    var numVertices = this.geometry.numVertices;
    var angleStep = 2 * Math.PI / numVertices;
    var i, angle;

    // Clear current vertices.
    vertices.splice(0, vertices.length);

    for (i = 0; i <= numVertices; ++i) {
      vertices.push(vec2(0, 0));
      angle = i * angleStep;
      vertices.push(vec2(radius * Math.cos(angle), radius * Math.sin(angle)));
      angle = (i + 1) * angleStep;
      vertices.push(vec2(radius * Math.cos(angle), radius * Math.sin(angle)));
    }
  },

  tessellatePolygon: function tessellatePolygon() {
    var vertices = this.geometry.vertices;
    var numVertices = this.geometry.numVertices;
    var i;

    for (i = 0; i < numVertices; ++i) {
      this.divideTriangle(vertices[3 * i],
                          vertices[3 * i + 1],
                          vertices[3 * i + 2],
                          this.geometry.numSubdivisions);
    }
  },

  addTriangle: function addTriangle(a, b, c) {
    this.geometry.points.push(a, b, c);
  },

  divideTriangle: function divideTriangle(a, b, c, n) {
    if (n === 0) {
      this.addTriangle(a, b, c);
      return;
    }

    var ab = mix(a, b, 0.5);
    var ac = mix(a, c, 0.5);
    var bc = mix(b, c, 0.5);
    --n;

    this.divideTriangle(a, ab, ac, n);
    this.divideTriangle(c, ac, bc, n);
    this.divideTriangle(b, bc, ab, n);
    this.divideTriangle(ac, ab, bc, n);
  },

  twistPolygon: function twistPolygon(angle) {
    var points = this.geometry.points;
    var K = 1.0;
    var i, d, x, y, T;

    for (i = 0; i < points.length; i++) {
        x = points[i][0];
        y = points[i][1];
        d = Math.sqrt(x * x + y * y);
        T = K * d * angle;
        points[i] = vec2(x * Math.cos(T) - y * Math.sin(T),
                         x * Math.sin(T) + y * Math.cos(T));
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

