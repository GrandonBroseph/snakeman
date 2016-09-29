(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var snakeman = require("./snakeman/main");
window.onload = function(){
    snakeman.init();
};

},{"./snakeman/main":3}],2:[function(require,module,exports){
module.exports = (function(){
  function Vector(x, y){
    var o = Vector.resolve(x, y);
    this.x = o.x;
    this.y = o.y;
  }

  Vector.resolve = function(x, y) {
    if (typeof y === "undefined") {
      var t = typeof x;
      if (typeof x === "undefined") {
        x = 0;
        y = 0;
      } else if (x instanceof Vector) {
        y = x.y;
        x = x.x;
      } else if (x.constructor.name === "Array") {
        y = x[1];
        x = x[0];
      } else if (typeof x === "number") {
        y = 0;
      }
    }
    return {x: x, y: y};
  }

  Vector.prototype = {
    resolve:    Vector.resolve,
    add:        function(x, y) {
      o = Vector.resolve(x, y);
      x = o.x;
      y = o.y;
      this.x += x;
      this.y += y;
      return this;
    },
    added:      function(x, y) {
      o = Vector.resolve(x, y);
      x = o.x;
      y = o.y;
      return new Vector(this.x + x, this.y + y);
    },
    subtract:   function(x, y) {
      o = Vector.resolve(x, y);
      x = o.x;
      y = o.y;
      this.x -= x;
      this.y -= y;
      return this;
    },
    subtracted: function(x, y) {
      o = Vector.resolve(x, y);
      x = o.x;
      y = o.y;
      return new Vector(this.x - x, this.y - y);
    },
    multiply: function(x, y) {
      o = Vector.resolve(x, y);
      x = o.x;
      y = o.y;
      this.x *= x;
      this.y *= y;
      return this;
    },
    multiplied: function(x, y) {
      o = Vector.resolve(x, y);
      x = o.x;
      y = o.y;
      return new Vector(this.x * x, this.y * y);
    },
    divide: function(x, y) {
      o = Vector.resolve(x, y);
      x = o.x;
      y = o.y;
      this.x /= x;
      this.y /= y;
      return this;
    },
    divided: function(x, y) {
      o = Vector.resolve(x, y);
      x = o.x;
      y = o.y;
      return new Vector(this.x / x, this.y / y);
    },
    dot: function(x, y) {
      o = Vector.resolve(x, y);
      x = o.x;
      y = o.y;
      return this.x * x + this.y * y;
    },
    clone: function() {
      return new Vector(this.x, this.y);
    },
    set : function(x, y){
      o = Vector.resolve(x, y);
      this.x = o.x;
      this.y = o.y;
      return this;
    },
    floor : function() {
      this.x = Math.floor(this.x);
      this.y = Math.floor(this.y);
      return this;
    },
    floored : function() {
      return new Vector(Math.floor(this.x), Math.floor(this.y));
    },
    round : function() {
      this.x = Math.round(this.x);
      this.y = Math.round(this.y);
      return this;
    },
    rounded : function() {
      return new Vector(Math.round(this.x), Math.round(this.y));
    },
    scale: function(scalar) {
      this.x *= scalar;
      this.y *= scalar;
      return this;
    },
    scaled: function(scalar) {
      return new Vector(this.x * scalar, this.y * scalar);
    },
    string: function(){
      return this.x+", "+this.y;
    }
  }

  function Rect(x, y, width, height){

    var pos, size;

    if (typeof width !== "undefined" && typeof height !== "undefined"){
      pos  = new Vector(x, y);
      size = new Vector(width, height);
    } else {
      pos = new Vector(x);
      size = new Vector(y);
    }

    this.pos = pos;
    this.size = size;

    var property, obj;

    for (property in this.properties) {
      obj = this.properties[property];
      Object.defineProperty(this, property, obj);
    }
  }

  Rect.prototype = {
    properties: {
      "left": {
        get: function(){
          return this.pos.x;
        },
        set: function(value){
          this.pos.x = value;
        }
      },
      "right": {
        get: function(){
          return this.pos.x + this.size.x;
        },
        set: function(value){
          this.pos.x = value - this.size.x;
        }
      },
      "top": {
        get: function(){
          return this.pos.y;
        },
        set: function(value){
          this.pos.y = value;
        }
      },
      "bottom": {
        get: function(){
          return this.pos.y + this.size.y;
        },
        set: function(value){
          this.pos.y = value - this.size.y;
        }
      },
      "x": {
        get: function(){
          return this.pos.x;
        },
        set: function(value){
          this.pos.x = value;
        }
      },
      "y": {
        get: function(){
          return this.pos.y;
        },
        set: function(value){
          this.pos.y = value;
        }
      },
      "width": {
        get: function(){
          return this.size.x;
        },
        set: function(value){
          this.size.x = value;
        }
      },
      "height": {
        get: function(){
          return this.size.y;
        },
        set: function(value){
          this.size.y = value;
        }
      },
      "center": {
        get: function(){
          return new Vector(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2);
        },
        set: function(value){
          this.pos.x = value.x - this.size.x / 2;
          this.pos.y = value.y - this.size.y / 2;
        }
      }
    },
    added:      function(x, y) {
      o = Vector.resolve(x, y);
      x = o.x;
      y = o.y;
      return new Rect(this.pos.x + x, this.pos.y + y, this.size.x, this.size.y);
    },
    clone:      function() {
      return new Rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    },
    set:        function(x, y, width, height) {
      if (x instanceof Rect) {
        this.pos.x  = x.pos.x;
        this.pos.y  = x.pos.y;
        this.size.x = x.size.x;
        this.size.y = x.size.y;
        return;
      }
      this.pos.x = x;
      this.pos.y = y;
      this.size.x = width;
      this.size.y = height;
    },
    intersects: function(other) {
      if (other instanceof Vector) {
        return this.left < other.x && this.right > other.x && this.top < other.y && this.bottom > other.y;
      } else if (other instanceof Rect) {
        return this.left < other.right && this.right > other.left && this.top < other.bottom && this.bottom > other.top;
      } else {
        return false;
      }
    },
    contains: function(other) {
      if (other instanceof Vector) {
        return other.x > this.left && other.x < this.right && other.y > this.top && other.y < this.bottom;
      } else if (other instanceof Rect) {
        return other.left > this.left && other.right < this.right && other.top > this.top && other.bottom < this.bottom;
      } else {
        return false;
      }
    },
    string: function(){
      return this.left+" -> "+this.right+", "+this.top+" -> "+this.bottom;
    }
  };

  return {
    Vector: Vector,
    Rect: Rect
  };
})();

},{}],3:[function(require,module,exports){
module.exports = (function(){
    var geometry = require("./geometry");
    var video = require("./video");

    function init() {
        video.load("img/tileset.png", function(){
            this.init();
        });
    }

    return {
        init: init
    }
})();

},{"./geometry":2,"./video":4}],4:[function(require,module,exports){
module.exports = (function(){
  var geometry = require("./geometry"),
      images = {},
      tilesets = {},
      tileSize = new geometry.Vector(16, 16),
      viewTileSize = new geometry.Vector(16, 14),
      viewSize = tileSize.multiplied(viewTileSize);

  function Surface(size) {
    this.size = null;
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.resize(size);
  }

  Surface.prototype = {
    resize: function(newSize) { // Do note that changing the dimensions of the canvas also resets all of its properties, so additional setup is required.
      this.size = newSize.clone();
      this.canvas.width = newSize.x;
      this.canvas.height = newSize.y;
      this.context.mozImageSmoothingEnabled = false;
      this.context.webkitImageSmoothingEnabled = false;
      this.context.msImageSmoothingEnabled = false;
      this.context.imageSmoothingEnabled = false;
    },
    blit: function(src, offset, scale) {
      offset = new geometry.Vector((offset || [0, 0]));
      scale = scale || 1;
      this.context.drawImage(src, offset.x, offset.y, src.width * scale, src.height * scale);
    },
    data: function() {
      return this.canvas.toDataURL("image/png");
    }
  };

  function Sprite(rect, surface) {
    if (rect instanceof geometry.Vector || rect.constructor.name === "Array")
      rect = new geometry.Rect([0, 0], rect);
    if (typeof surface === "undefined") {
      surface = new Surface(rect.size);
    }
    this.rect = rect;
    this.surface = surface;
    this.scale = 1;
    this.children = [];
  }

  Sprite.prototype = {
    append: function(child) {
      if (this.children.indexOf(child) == -1)
        this.children.push(child);
    },
    remove: function(child) {
      var index = this.children.indexOf(child);
      index != -1 && this.children.splice(index, 1);
    },
    manifest: function(target) {
      target = target || document.body;
      target.appendChild(this.surface.canvas);
    },
    resize: function(newSize) {
      this.rect.size = newSize.clone();
      this.surface.resize(newSize);
    },
    draw: function(target, offset) {
      offset = offset || new geometry.Vector(0, 0);
      if (typeof target !== "undefined") {
        target.blit(this.surface.canvas, this.rect.pos.added(offset), this.scale);
      }
      for (var i = 0, max = this.children.length, sprite; i < max; i ++) {
        sprite = this.children[i];
        sprite.draw(this.surface, offset);
      }
    },
    update: function() {

    }
  };

  var display = new Sprite(viewSize);
  var wrapper = new Sprite([0, 0]);

  display.append(wrapper);

  function resize() {
    var outer, inner, dimensions, scale, tileSizeScaled, viewSizeScaled, view, full, start, dist, end, i, j, image, min, max;
    outer = tilesets.tileset[0][0].canvas;
    inner = tilesets.tileset[0][1].canvas;
    dimensions = new geometry.Vector(Math.max(document.documentElement.clientWidth, window.innerWidth || 0), Math.max(document.documentElement.clientHeight, window.innerHeight || 0));
    display.resize(dimensions);
    scale = Math.max(Math.min(Math.floor(dimensions.x / viewSize.x), Math.floor(dimensions.y / viewSize.y)), 1);
    tileSizeScaled = tileSize.scaled(scale);
    viewSizeScaled = viewSize.scaled(scale);

    view = new geometry.Vector(dimensions.x / 2 - viewSizeScaled.x / 2, dimensions.y / 2 - viewSizeScaled.y / 2);
    min = view.divided(tileSizeScaled);
    max = min.added(viewTileSize);
    start = new geometry.Vector();
    end = new geometry.Vector();

    for (i = view.x; i > 0; i -= tileSizeScaled.x);
    start.x = end.x = i;
    for (end.x = view.x; end.x < dimensions.x; end.x += tileSizeScaled.x);

    for (i = view.y; i > 0; i -= tileSizeScaled.y);
    start.y = end.y = i;
    for (end.y = view.y; end.y < dimensions.y; end.y += tileSizeScaled.y);

    full = new geometry.Rect(start, end.subtracted(start));

    wrapper.resize(full.size.scaled(1 / scale));

    for (i = 0; i < wrapper.rect.height / tileSize.y; i ++) {
      for (j = 0; j < wrapper.rect.width / tileSize.x; j ++) {
        if (j >= min.x && i >= min.y && j < max.x && i < max.y) {
          image = inner;
        } else {
          image = outer;
        }
        wrapper.surface.blit(image, [j * tileSize.x, i * tileSize.y]);
      }
    }

    wrapper.rect.pos.set(full.pos);
    wrapper.scale = scale;

    display.draw();
  }

  function addEvent(type, callback) {
    if (!this) return;
    if (this.addEventListener) {
      this.addEventListener(type, callback, false);
    } else if (this.attachEvent) {
      this.attachEvent("on" + type, callback);
    } else {
      this["on" + type] = callback;
    }
  }

  return {
    images: images,
    tilesets: tilesets,
    init: function() {
      display.manifest();
      resize();
      addEvent("resize", resize);
      addEvent("orientationchange", resize);
      return this;
    },
    load: function(path, id, callback) {
      var module = this;
      if (id.constructor.name === "Function") {
        callback = id;
        id = null;
      }
      var image = new Image();
      id = id || path.match(/.+\/(.+)\.png/)[1];
      image.onload = function() {
        images[id] = image;
        tilesets[id] = [];
        for (var i = 0; i < image.height / tileSize.y; i ++) {
          tilesets[id].push([]);
          for (var j = 0; j < image.width / tileSize.x; j ++) {
            var surface = new Surface(tileSize);
            surface.blit(image, new geometry.Vector(-j * tileSize.x, -i * tileSize.y));
            tilesets[id][i].push(surface);
          }
        }
        callback.call(module);
      }
      image.src = path;
      return this;
    },
    update: function() {

    }
  };
})();

},{"./geometry":2}]},{},[1])