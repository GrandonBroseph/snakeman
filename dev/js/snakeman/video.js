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
