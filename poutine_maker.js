/**
 * poutine_maker.js
 *
 * Render a poutine maker field as a canvas with all the ingredients
 * in a circle around the name of the poutine. Animate it just because
 * we can. Add a fork because that's hilarious.
 */
(function ($) {
function PoutineMakerAnimation(canvas) {
  this.canvas = canvas;
  this.size = {
    width: canvas.width(),
    height: canvas.height(),
  };
  this.canvasRaw = canvas.get(0);
  this.canvasID = this.canvas.attr('id');
  this.context = this.canvasRaw.getContext("2d");
  this.run = function () {
    var i, image, context, json;
    this.images = [];
    json = window[this.canvasID];
    this.data = json['toppings'];
    this.title = json['title'];
    context = this.context;
    this.loadCount = 0;
    this.loadedNeeded = this.data.length + 1;
    for (i=0; i < this.data.length; i++) {
      image = new Image();
      image.src = this.data[i];
      image.onload = (function (thisAnimation, img, i) {
        return function () {
          context.drawImage(img, 100*i, 0);
          thisAnimation.loadCount += 1;
          if (thisAnimation.loadCount === thisAnimation.loadedNeeded) {
            thisAnimation.animate();
          }
        };
      }(this, image, i));
      this.images.push(image);
    }
    bg = new Image();
    bg.src = json['bg'];
    bg.onload = (function (thisAnimation) {
      return function () {
        thisAnimation.loadCount += 1;
        if (thisAnimation.loadCount === thisAnimation.loadedNeeded) {
          thisAnimation.animate();
        }
      };
    }(this));
    this.bg = bg;

    this.fork = new Image();
    this.fork.src = json['fork'];

    this.vegetarian = json['vegetarian'];

    this.mouseX = 0;
    this.mouseY = 0;
  };

  this.drawFork = function () {
    var x, y;
    x = this.mouseX - this.fork.width/2.0;
    y = this.mouseY - this.fork.height/2.0;
    this.context.drawImage(this.fork, x, y);
  };

  this.animate = function () {
    var count = 0, mouseX = 0, mouseY = 0, loop, animthis;
    animthis = this;

    this.canvas.mousemove(function (event) {
      var x, y;
      x = event.offsetX;
      y = event.offsetY;
      animthis.mouseX = x;
      animthis.mouseY = y;
      animthis.drawFork();
    });

    loop = (function (t) {
      return function () {
        (function (animateCount) {
          var i, origin, radius, circleDegrees, spacingDegrees, calcOriginOffset,
                image, textWidth, offsetDegrees, mousePos;
          t.context.clearRect(0, 0, t.size.width, t.size.height);
          t.context.drawImage(t.bg, 0, 0, t.size.width, t.size.height);
          offsetDegrees = animateCount * (Math.PI/(1000/5));
          radius = 190.0 + 30*Math.sin(count/10.0);

          origin = (function (w, h) {
            return {
              x: w/2.0,
              y: h/2.0,
            };
          }(t.size.width, t.size.height));
          circleDegrees = 2 * Math.PI;
          spacingDegrees = circleDegrees/t.images.length;
          calcOriginOffset = function (radius, degrees, w, h) {
            var dx, dy, x, y;
            dx = (Math.cos(degrees) * radius) - w/2.0;
            dy = (Math.sin(degrees) * radius) - h/2.0;
            x = origin.x + dx;
            y = origin.y + dy;
            return {
              x: x,
              y: y,
            };
          };
          for (i=0; i < t.images.length; i++) {
            image = t.images[i];
            newPosition = calcOriginOffset(radius, offsetDegrees + i*spacingDegrees, image.width, image.height);
            t.context.drawImage(image, newPosition.x, newPosition.y);
          }
          t.context.font = "bold 20px sans-serif";
          t.context.fillStyle = "#fff";
          t.context.textAlign = "center";
          //textWidth = t.context.measureText(t.title).width;
          t.context.fillText(t.title, origin.x, origin.y);
          t.context.fillStyle = "#000";
          t.context.fillText(t.title, origin.x + 1, origin.y + 1);
          if (t.vegetarian === true) {
            t.context.font = "bold 12px sans-serif";
            t.context.textAlign = "left";
            t.context.fillStyle = "#fff";
            t.context.fillText("This is a vegetarian poutine!", 5, t.size.height-15);
          }

          t.drawFork();
        }(count));
        count += 1;
        setTimeout(loop, 1000/60.0);
      };
    }(this));
    loop();
  }
}

function runCanvases() {
  var canvases, animations;
  animations = [];
  canvases = $('canvas.poutine-maker-animation');
  canvases.each(function (i, el) {
    var anim = new PoutineMakerAnimation($(el));
    animations.push(anim)
    anim.run();
  });
}
$(document).ready(function () {
  runCanvases();
});
}(jQuery));
