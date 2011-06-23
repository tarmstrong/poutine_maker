/**
 * poutine_maker.js
 *
 * Render a poutine maker field as a canvas with all the ingredients
 * in a circle around the name of the poutine. Animate it just because
 * we can. Add a fork because that's hilarious.
 */
(function ($) {

// Manage a poutine formatter animation
function PoutineMakerAnimation(canvas) {
  this.canvas = canvas;
  this.size = {
    width: canvas.width(),
    height: canvas.height(),
  };
  this.canvasRaw = canvas.get(0);
  this.canvasID = this.canvas.attr('id');
  this.context = this.canvasRaw.getContext("2d");

  // Set up the animation and then call animate() to start animating
  this.run = function () {
    var i, image, context, json;
    this.images = [];
    json = window[this.canvasID];
    this.data = json['toppings']; // topping URLs
    this.title = json['title'];
    context = this.context;

    this.loadCount = 0;
    this.loadedNeeded = this.data.length + 1;

    // Pre-load ingredient images
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

    // Pre-load the background image
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

    // Preload the fork image
    this.fork = new Image();
    this.fork.src = json['fork'];

    this.vegetarian = json['vegetarian'];

    this.mouseX = 0;
    this.mouseY = 0;
  };

  // Draw a fork using the most recent mouse position.
  this.drawFork = function () {
    var x, y;

    // correct for image width
    x = this.mouseX - this.fork.width/2.0;
    y = this.mouseY - this.fork.height/2.0;

    // Firefox returns negative/undefined for mouse position
    // TODO Firefox support
    if (x > 0 && y > 0) {
      this.context.drawImage(this.fork, x, y);
    }
  };

  // Start the animation of ingredients.
  // Loops continually, redrawing the images and text
  // in the updated positions.
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
          var i, origin, radius, circleRadians, spacingRadians, calcOriginOffset,
                image, textWidth, offsetRadians, mousePos;

          // clear the canvas
          t.context.clearRect(0, 0, t.size.width, t.size.height);

          // draw the background poutine
          t.context.drawImage(t.bg, 0, 0, t.size.width, t.size.height);

          // calculate how many radians around the circle
          // the first image will be drawn
          offsetRadians = animateCount * (Math.PI/(1000/5));
          radius = 190.0 + 30*Math.sin(count/10.0);

          // Calculate the centre of the canvas
          origin = (function (w, h) {
            return {
              x: w/2.0,
              y: h/2.0,
            };
          }(t.size.width, t.size.height));

          circleRadians = 2 * Math.PI;
          // calculate the size of a 'pizza slice'
          spacingRadians = circleRadians/t.images.length;

          // Calculate the position of the image,
          // using the origin, degrees from theta=0, and
          // the dimensions of the image.
          // radius = the distance from the origin that the
          // centre of the image will be.
          calcOriginOffset = function (radius, radians, w, h) {
            var dx, dy, x, y;
            dx = (Math.cos(radians) * radius) - w/2.0;
            dy = (Math.sin(radians) * radius) - h/2.0;
            x = origin.x + dx;
            y = origin.y + dy;
            return {
              x: x,
              y: y,
            };
          };

          // Calculate the position of each image and then draw it
          for (i=0; i < t.images.length; i++) {
            image = t.images[i];
            newPosition = calcOriginOffset(radius, offsetRadians + i*spacingRadians, image.width, image.height);
            t.context.drawImage(image, newPosition.x, newPosition.y);
          }

          // Write the title of the poutine

          t.context.font = "bold 20px sans-serif";
          t.context.fillStyle = "#fff";
          t.context.textAlign = "center";
          //textWidth = t.context.measureText(t.title).width;
          t.context.fillText(t.title, origin.x, origin.y);
          t.context.fillStyle = "#000";
          t.context.fillText(t.title, origin.x + 1, origin.y + 1);

          // Add vegetarian note if the poutine is supposed to
          // be vegetarian.
          if (t.vegetarian === true) {
            t.context.font = "bold 12px sans-serif";
            t.context.textAlign = "left";
            t.context.fillStyle = "#fff";
            t.context.fillText("This is a vegetarian poutine!", 5, t.size.height-15);
          }

          // Draw the fork last so it shows up on top
          // (and minimizes flicker).
          t.drawFork();
        }(count));

        count += 1;

        // start the loop function again
        setTimeout(loop, 1000/60.0);
      };
    }(this));

    // start the loop function for the first time.
    loop();
  }
}

// Find all the poutine-maker canvases
// and then run them.
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
