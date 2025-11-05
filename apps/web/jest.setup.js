import '@testing-library/jest-dom'

// Mock HTMLCanvasElement.prototype.getContext for fabric.js
HTMLCanvasElement.prototype.getContext = function() {
  return {
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    lineCap: 'butt',
    lineJoin: 'miter',
    miterLimit: 10,
    setLineDash: function() {},
    getLineDash: function() { return [] },
    fillRect: function() {},
    clearRect: function() {},
    getImageData: function(x, y, w, h) {
      return { data: new Array(w * h * 4) }
    },
    putImageData: function() {},
    createImageData: function() { return [] },
    setTransform: function() {},
    drawImage: function() {},
    save: function() {},
    fillText: function() {},
    restore: function() {},
    beginPath: function() {},
    moveTo: function() {},
    lineTo: function() {},
    closePath: function() {},
    stroke: function() {},
    translate: function() {},
    scale: function() {},
    rotate: function() {},
    arc: function() {},
    fill: function() {},
    measureText: function() {
      return { width: 0 }
    },
    transform: function() {},
    rect: function() {},
    clip: function() {},
  }
}

// Mock toDataURL
HTMLCanvasElement.prototype.toDataURL = function() {
  return 'data:image/png;base64,mock'
}
