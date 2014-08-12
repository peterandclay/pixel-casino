(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"C:\\Users\\Yawmus\\AppData\\Roaming\\npm\\node_modules\\watchify\\node_modules\\browserify\\node_modules\\process\\browser.js":[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],"F:\\Programming\\Javascript\\pixel-casino\\lib\\headOn.js":[function(require,module,exports){
//     __  __         __           _
//    / / / /__  ____ _____/ /  ____  ____         (_)____
//   / /_/ / _ \/ __ `/ __  /_____/ __ \/ __ \    / / ___/
//  / __  /  __/ /_/ / /_/ /_____/ /_/ / / / /   / (__  )
// /_/ /_/\___/\__,_/\__,_/      \____/_/ /_(_)_/ /____/
//                         /___/
(function(window, undefined){
  "use strict";
  var headOn = (function(){

    var headOn = {

        groups: {},
        _images: {},
        fps: 30,
        imagesLoaded: true,
        gameTime: 0,
        _update:"",
        _render:"",
        _ticks: 0,

        randInt: function(min, max) {
          return Math.floor(Math.random() * (max +1 - min)) + min;
        },
        randFloat: function(min, max) {
          return Math.random() * (max - min) + min;
        },
        events: {
          events: {},
          listen: function(eventName, callback){
            var id = headOn.uId();
            if(!this.events[eventName]){
              this.events[eventName] = [];
            }
            this.events[eventName].push({cb:callback, id:id});
          },
          unlisten:function(eventName, id){
            if(!this.events[eventName]) return;
            this.events[eventName].forEach(function(e, i){
              if(e.id === id){
                this.events[eventName].splice(i,1);
              }
            });
          },
          trigger: function(eventName){
            var args = [].splice.call(arguments, 1),
              e = this.events[eventName],
              l,
              i;
            if(e){
              l = e.length;
              for(i = 0; i < l; i++){
                e[i].cb.apply(headOn, args);
              }
            }

          }
        },
        uId: function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
        },
        FSM: function(entity){
          this.entity = entity;
          return this;
        },
        Camera: function(width, height, x, y, zoom){
          this.width = width;
          this.height = height;
          x = x || 0;
          y = y || 0;
          this.position = headOn.Vector(x, y);
          this.dimensions = headOn.Vector(width, height);
          this.center = headOn.Vector(x+width/2, y+height/2);
          this.zoomAmt = zoom || 1;
          return this;
        },
        animate: function(object,keyFrames,callback){
          var that, interval, currentFrame = 0;
          if(!object.animating){
            object.animating = true;
            object.image = keyFrames[0];
            that = this;

            interval = setInterval(function(){
              if(keyFrames.length === currentFrame){
                callback();
                object.animating = false;
                object.image = "";
                clearInterval(interval);
              }
              else{
                currentFrame += 1;
                object.image = keyFrames[currentFrame];
              }
            },1000/this.fps);
          }



        },

        update: function(cb){this._update = cb;},

        render: function(cb){this._render = cb;},

        entity: function(values, parent){
          var i, o, base;
          if (parent && typeof parent === "object") {
            o = Object.create(parent);
          }
          else{
            o = {};
          }
          for(i in values){
            if(values.hasOwnProperty(i)){
              o[i] = values[i];
            }
          }
          return o;
        },
        inherit: function (base, sub) {
          // Avoid instantiating the base class just to setup inheritance
          // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
          // for a polyfill
          sub.prototype = Object.create(base.prototype);
          // Remember the constructor property was set wrong, let's fix it
          sub.prototype.constructor = sub;
          // In ECMAScript5+ (all modern browsers), you can make the constructor property
          // non-enumerable if you define it like this instead
          Object.defineProperty(sub.prototype, 'constructor', {
            enumerable: false,
            value: sub
          });
        },

        extend: function(base, values){
          var i;
          for(i in values){
            if(values.hasOwnProperty(i)){
              base[i] = values[i];
            }
          }
        },
        clone: function (obj) {
          // Handle the 3 simple types, and null or undefined
          if (null === obj || "object" != typeof obj) return obj;
          var copy;
          // Handle Date
          if (obj instanceof Date) {
              copy = new Date();
              copy.setTime(obj.getTime());
              return copy;
          }

          // Handle Array
          if (obj instanceof Array) {
              copy = [];
              for (var i = 0, len = obj.length; i < len; i++) {
                  copy[i] = clone(obj[i]);
              }
              return copy;
          }

          // Handle Object
          if (obj instanceof Object) {
              copy = {};
              for (var attr in obj) {
                  if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
              }
              return copy;
          }

          throw new Error("Unable to copy obj! Its type isn't supported.");
        },
        collides: function(poly1, poly2, center) {
          var points1 = this.getPoints(poly1, center),
            points2 = this.getPoints(poly2, center),
            i = 0,
            l = points1.length,
            j, k = points2.length,
            normal = {
              x: 0,
              y: 0
            },
            length,
            min1, min2,
            max1, max2,
            interval,
            MTV = null,
            MTV2 = null,
            MN = null,
            dot,
            nextPoint,
            currentPoint;

          if(poly1.type === "circle" && poly2.type ==="circle"){
            return circleCircle(poly1, poly2);
          }else if(poly1.type === "circle"){
            return circleRect(poly1, poly2);
          }else if(poly2.type === "circle"){
            return circleRect(poly2, poly1);
          }


          //loop through the edges of Polygon 1
          for (; i < l; i++) {
            nextPoint = points1[(i == l - 1 ? 0 : i + 1)];
            currentPoint = points1[i];

            //generate the normal for the current edge
            normal.x = -(nextPoint[1] - currentPoint[1]);
            normal.y = (nextPoint[0] - currentPoint[0]);

            //normalize the vector
            length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
            normal.x /= length;
            normal.y /= length;

            //default min max
            min1 = min2 = -1;
            max1 = max2 = -1;

            //project all vertices from poly1 onto axis
            for (j = 0; j < l; ++j) {
              dot = points1[j][0] * normal.x + points1[j][1] * normal.y;
              if (dot > max1 || max1 === -1) max1 = dot;
              if (dot < min1 || min1 === -1) min1 = dot;
            }

            //project all vertices from poly2 onto axis
            for (j = 0; j < k; ++j) {
              dot = points2[j][0] * normal.x + points2[j][1] * normal.y;
              if (dot > max2 || max2 === -1) max2 = dot;
              if (dot < min2 || min2 === -1) min2 = dot;
            }

            //calculate the minimum translation vector should be negative
            if (min1 < min2) {
              interval = min2 - max1;

              normal.x = -normal.x;
              normal.y = -normal.y;
            } else {
              interval = min1 - max2;
            }

            //exit early if positive
            if (interval >= 0) {
              return false;
            }

            if (MTV === null || interval > MTV) {
              MTV = interval;
              MN = {
                x: normal.x,
                y: normal.y
              };
            }
          }

          //loop through the edges of Polygon 2
          for (i = 0; i < k; i++) {
            nextPoint = points2[(i == k - 1 ? 0 : i + 1)];
            currentPoint = points2[i];

            //generate the normal for the current edge
            normal.x = -(nextPoint[1] - currentPoint[1]);
            normal.y = (nextPoint[0] - currentPoint[0]);

            //normalize the vector
            length = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
            normal.x /= length;
            normal.y /= length;

            //default min max
            min1 = min2 = -1;
            max1 = max2 = -1;

            //project all vertices from poly1 onto axis
            for (j = 0; j < l; ++j) {
              dot = points1[j][0] * normal.x + points1[j][1] * normal.y;
              if (dot > max1 || max1 === -1) max1 = dot;
              if (dot < min1 || min1 === -1) min1 = dot;
            }

            //project all vertices from poly2 onto axis
            for (j = 0; j < k; ++j) {
              dot = points2[j][0] * normal.x + points2[j][1] * normal.y;
              if (dot > max2 || max2 === -1) max2 = dot;
              if (dot < min2 || min2 === -1) min2 = dot;
            }

            //calculate the minimum translation vector should be negative
            if (min1 < min2) {
              interval = min2 - max1;

              normal.x = -normal.x;
              normal.y = -normal.y;
            } else {
              interval = min1 - max2;


            }

            //exit early if positive
            if (interval >= 0) {
              return false;
            }

            if (MTV === null || interval > MTV) MTV = interval;
            if (interval > MTV2 || MTV2 === null) {
              MTV2 = interval;
              MN = {
                x: normal.x,
                y: normal.y
              };
            }
          }

          return {
            overlap: MTV2,
            normal: MN
          };
          function circleRect(circle, rect){
            var newX = circle.position.x * Math.cos(-rect.angle);
            var newY = circle.position.y * Math.sin(-rect.angle);
            var circleDistance = {x:newX, y:newY};
            var cornerDistance_sq;
            circleDistance.x = Math.abs(circle.position.x - rect.position.x);
              circleDistance.y = Math.abs(circle.position.y - rect.position.y);

              if (circleDistance.x > (rect.width/2 + circle.radius)) { return false; }
              if (circleDistance.y > (rect.height/2 + circle.radius)) { return false; }

              if (circleDistance.x <= (rect.width/2)) { return true; }
              if (circleDistance.y <= (rect.height/2)) { return true; }

              cornerDistance_sq = Math.pow(circleDistance.x - rect.width/2,2) +
                                   Math.pow(circleDistance.y - rect.height/2, 2);

              return (cornerDistance_sq <= Math.pow(circle.radius,2));
          }
          function pointInCircle(point, circle){
            return Math.pow(point.x - circle.position.x ,2) + Math.pow(point.y - circle.position.y, 2) < Math.pow(circle.radius,2);
          }
          function circleCircle(ob1, ob2){
            return square(ob2.position.x - ob1.position.x) + square(ob2.position.y - ob1.position.y) <= square(ob1.radius + ob2.radius);
          }
        },

        getPoints: function (obj, center){
          if(obj.type === "circle"){
            return [];
          }
          var x = obj.position.x,
            y = obj.position.y,
            width = obj.width,
            height = obj.height,
            angle = obj.angle,
            that = this,
            h,
            w,
            points = [];
          if(!center){
            points[0] = [x,y];
            points[1] = [];
            points[1].push(Math.sin(-angle) * height + x);
            points[1].push(Math.cos(-angle) * height + y);
            points[2] = [];
            points[2].push(Math.cos(angle) * width + points[1][0]);
            points[2].push(Math.sin(angle) * width + points[1][1]);
            points[3] = [];
            points[3].push(Math.cos(angle) * width + x);
            points[3].push(Math.sin(angle) * width + y);
          }else{
            w = (width/2);
            h = (height/2);
            points[0] = [x-w, y-h];
            points[1] = [x+w, y-h];
            points[2] = [x+w, y+h];
            points[3] = [x-w, y+h];
          }

            //console.log(points);
          return points;

        },

        Timer: function(){
          this.jobs = [];
        },
        pause: function(){
          this.paused = true;
          this.events.trigger("pause");
        },
        unpause: function(){
          this.events.trigger("unpause");
          this.paused = false;
        },
        isPaused: function(){
          return this.paused;
        },
        group: function(groupName, entity){
          if(this.groups[groupName]){
            if(entity){
              this.groups[groupName].push(entity);
            }
          }
          else{
            this.groups[groupName] = [];
            if(entity){
              this.groups[groupName].push(entity);
            }
          }
          return this.groups[groupName];
        },

        loadImages: function(imageArray, progress, allCallback){
          var args, img, total, loaded, timeout, interval, that, cb, imgOnload;
          that = this;
          this.imagesLoaded = false;
          total = imageArray.length;
          if(!total){
            this.imagesLoaded = true;
          }
          loaded = 0;
          imgOnload = function(){
            loaded += 1;
            progress && progress(loaded, total);
            if(loaded === total){
              allCallback && allCallback();
              that.imagesLoaded = true;
            }
          };
          imageArray.forEach(function(image){
            img = new Image();
            img.src = image.src;
            img.onload = imgOnload;

            that._images[image.name] = img;
          });
        },
        setFPS: function(fps){
          this.fps = fps;
          this.events.trigger("FPS change");
        },
        debug: function(){
          if(window.DEBUG){
            console.log.apply(console, arguments);
          }
          return;
        },
        images: function(image){
          if(this._images[image]){
            return this._images[image];
          }
          else{
            return new Image();
          }
        },


        timeout: function(cb, time, scope){
          setTimeout(function(){
            cb.call(scope);
          }, time);
        },

        interval: function(cb, time, scope){
          return setInterval(function(){
            cb.call(scope);
          }, time);
        },
        canvas: function(name){
          if(this === headOn){
            return new this.canvas(name);
          }
          this.canvas = this.canvases[name];
          this.width = this.canvas.width;
          this.height = this.canvas.height;
          return this;
        },

        Vector: function(x, y){
          if(this === headOn){
            return new headOn.Vector(x,y);
          }
          if(typeof x !== "number"){
            if(x){
              this.x = x.x;
              this.y = x.y;
            }else{
              this.x = 0;
              this.y = 0;
            }

          }else{
            this.x = x;
            this.y = y;
          }
          return this;
        },
        run: function(){
          var that = this;
          var then = Date.now();
          var now;
          var interval = 1000/this.fps;
          var delta;
          window.requestAnimationFrame(aniframe);
          //setTimeout(updateFrame, 1000/this.fps);
         this.events.listen("FPS change", function(){
          that.debug(interval)
          interval = 1000/that.fps;
          that.debug(interval);
         })
          function aniframe(){
            var now = Date.now();
            delta = now - then;
            //We want the time inbetween frames not the time in between frames + time it took to do a frame
            if(delta > interval){
              that._update(delta);
              that.renderTick();
              then = now - (delta % interval);
            }
            

            window.requestAnimationFrame(aniframe);
          }

        },
        updateTick: function(then){
          var now = Date.now(),
          modifier = now - then;
          this.trueFps = 1/(modifier/1000);
          this._ticks+=1;
          this._update(modifier, this._ticks);
          this.gameTime += modifier;

        },
        renderTick: function(then){
          this._render();
        },
        exception: function(message){
          this.message = message;
          this.name = "Head-on Exception";
          this.toString = function(){
            return this.name + ": " + this.message;
          };
        }
    };

    headOn.canvas.create = function(name, width, height, camera, styles){
      var canvas, ctx;
      if(!camera || !(camera instanceof headOn.Camera)){
        throw new headOn.exception("Canvas must be intialized with a camera");
      }
      canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      if(styles){
        for(var key in styles){
          if(styles.hasOwnProperty(key)){
            canvas.style[key] = styles[key];
          }
        }
      }

      ctx = canvas.getContext("2d");
      this.prototype.canvases[name] = {
        canvas: canvas,
        ctx: ctx,
        width: canvas.width,
        height: canvas.height,
        camera: camera
      };
      return headOn.canvas(name);
    };
    headOn.canvas.prototype = {
      canvases: {},
      stroke: function(stroke){
        var ctx = this.canvas.ctx;
        ctx.save();
        if(stroke){
          ctx.lineWidth = stroke.width;
          ctx.strokeStyle = stroke.color;
          ctx.stroke();
        }
        ctx.restore();
      },
      drawRect: function(width, height, x, y, color, stroke, rotation){
        var ctx = this.canvas.ctx, mod = 1, camera = this.canvas.camera;
        var obj;
        if(arguments.length === 1 && typeof arguments[0] === "object"){
          obj = arguments[0];
          x = obj.x;
          y = obj.y;
          width = obj.width;
          height = obj.height;
          color = obj.color;
          stroke = obj.stroke;
          rotation = obj.rotation;
        }
        
        ctx.save();
        ctx.beginPath();

        if(rotation){
          ctx.translate(x,y);
          ctx.rotate(rotation);
          ctx.rect(0, 0, width, height);
        }
        else{
          //console.log(camera.position.x)
          if(obj && obj.camera === false){
            ctx.rect(x, y, width, height);
          }else{
            ctx.rect((x - camera.position.x)/camera.zoomAmt , (y - camera.position.y)/camera.zoomAmt , width / camera.zoomAmt, height / camera.zoomAmt);
          }
          
        }
        if(color){
          ctx.fillStyle = color;
        }

        ctx.fill();
        if(typeof stroke === "object" && !isEmpty(stroke)){
          this.stroke(stroke);
        }
        ctx.closePath();
        ctx.restore();
        return this;
      },
      drawCircle: function(x, y, radius, color, stroke){
        var ctx = this.canvas.ctx, mod = 1, camera = this.canvas.camera, oneArg;
        if(arguments.length === 1 && typeof arguments[0] === "object"){
          oneArg = true;
          x=arguments[0].x;
          y=arguments[0].y;
          radius=arguments[0].radius;
          color = arguments[0].color;
          stroke = arguments[0].stroke;
        }
        
        ctx.save();
        ctx.beginPath();
        if(oneArg && arguments[0].camera === false){
          ctx.arc(x, y, radius, 0, 2*Math.PI, false);
        }else{

          ctx.arc((x - camera.position.x)/camera.zoomAmt, (y - camera.position.y)/camera.zoomAmt, radius / camera.zoomAmt, 0, 2*Math.PI, false);
        }
        
        ctx.fillStyle = color || "black";
        ctx.fill();
        this.stroke(stroke);
        ctx.restore();
        ctx.closePath();
        return this;
      },
      drawImage: function(image,x,y){
        var ctx = this.canvas.ctx;
        var camera = this.canvas.camera;
        var coords = camera.unproject(headOn.Vector(x,y));
        try{
          ctx.drawImage(image,coords.x,coords.y);
        }
        catch(e){
          console.log(image);
        }
        return this;
      },
      drawLine: function(start, end, color){
        var ctx = this.canvas.ctx;
        var camera = this.canvas.camera;
        start = camera.unproject(start);
        end = camera.unproject(end);
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = color;
        ctx.stroke();
        ctx.restore();
      },
      drawImageRotated: function(image, rotation, x,y){
        var ctx = this.canvas.ctx;
        var radians = rotation * Math.PI / 180;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(radians);
        ctx.drawImage(image, 0-image.width, 0-image.height);
        ctx.restore();
        return this;
      },
      createGradient: function(options){
        var grd;
        var ctx = this.canvas.ctx;
        var camera = this.canvas.camera;
        var start;
        var end;
        if(options.camera !== false){
          start = camera.unproject(options.start);
          end = camera.unproject(options.end);
        }else{
          start = options.start;
          end = options.end;
        }
        if(options.type === "radial"){
          return ctx.createRadialGradient(start.x, start.y, options.radius1, end.x, end.y, options.radius2);
        }else{
          return ctx.createLinearGradient(start.x, start.y, end.x, end.y);
        }
        
      },
      drawText: function(textString, x, y, fontStyle, color, alignment, baseline){
        var ctx = this.canvas.ctx;
        ctx.save();

        if(fontStyle){
          ctx.font = fontStyle + " sans-serif";
        }
        if(color){
          ctx.fillStyle = color;
        }
        if(alignment){
          ctx.textAlign = alignment;
        }
        if(baseline){
          ctx.textBaseline = baseline;
        }

        ctx.fillText(textString,x,y);

        ctx.restore();
        return this;
      },

      append: function(element){
        element = document.querySelector(element);
        if(element){
          this.canvas.canvas = element.appendChild(this.canvas.canvas);
        }
        else{
          this.canvas.canvas = document.body.appendChild(this.canvas.canvas);
        }
        return this;
      },
      clear: function(){
        var ctx = this.canvas.ctx;
        ctx.clearRect(0,0, this.canvas.width, this.canvas.height);
      },
      setCamera: function(cam){
        this.canvas.camera = cam;
      }
    };
    headOn.FSM.prototype = {
      changeState: function(state){
        if(this.state){
          this.state.exit();
        }
           
        this.state = state;
        this.state.enter();
      },
      update: function(){
        var args = [].slice.call(arguments, 0);
        args.unshift(this.entity);
        this.state.execute.apply(null, args);  
      },
      setState: function(state){
        this.state = state;
      }
    },
    headOn.Timer.prototype = {
      job: function(time, start){
        var jiff = {
          TTL: time,
          remaining: start || time
        };
        this.jobs.push(jiff);
        return {
          ready: function(){
            return jiff.remaining <= 0;
          },
          reset: function(){
            jiff.remaining = jiff.TTL;
          },
          timeLeft: function(){
            return jiff.remaining;
          }
        };
      },
      update: function(time){
        this.jobs.forEach(function(j){
          j.remaining -= time;
        });
      }
    };
    headOn.Camera.prototype = {
      zoomIn: function(amt){
        this.zoomAmt /= amt;
        this.position = this.center.sub(this.dimensions.mul(this.zoomAmt / 2));
        return this;
      },
      zoomOut: function(amt){
        this.zoomAmt *= amt;
        this.position = this.center.sub(this.dimensions.mul(this.zoomAmt / 2));

        return this;
      },
      move: function(vec){
        this.position = this.position.add(vec);
        this.center = this.position.add(headOn.Vector(this.width, this.height).mul(0.5));
        headOn.events.trigger("cameraMoved", this);
        return this;
      },
      inView: function(vec){
        if(vec.x >= this.position.x && vec.x <= this.position.x + this.width *this.zoomAmt && vec.y >= this.position.y && vec.y <= this.position.y + this.height*this.zoomAmt){
          return true;
        }else{
          return false;
        }
      },
      moveTo: function(vec){
        this.position = vec.sub(this.dimensions.mul(0.5).mul(this.zoomAmt));
        headOn.events.trigger("cameraMoved", this);
        this.center = vec;
      },
      project: function(vec){
        return vec.mul(this.zoomAmt).add(this.position);
      },
      unproject: function(vec){
        return vec.mul(1/this.zoomAmt).sub(this.position);
      }
    };
    headOn.Vector.prototype = {
      normalize: function(){
        var len = this.length();
        if(len === 0){
          return headOn.Vector(0,0);
        }
        return headOn.Vector(this.x/len, this.y/len);
      },

      normalizeInPlace: function(){
        var len = this.length();
        this.x /= len;
        this.y /= len;
      },
      distance: function(vec2){
        return this.sub(vec2).length();
      },
      dot: function(vec2){
        return vec2.x * this.x + vec2.y * this.y;
      },

      length: function(){
        return Math.sqrt(this.x*this.x + this.y*this.y);
      },

      sub: function(vec2){
        return headOn.Vector(this.x - vec2.x, this.y - vec2.y);
      },

      add: function(vec2){
        return headOn.Vector(this.x + vec2.x, this.y + vec2.y);
      },
      truncate: function(max){
        var i;
        i = max / this.length();
        i = i < 1 ? i : 1;
        return this.mul(i);
      },
      mul: function(scalar){
        return headOn.Vector(this.x * scalar, this.y * scalar);
      }
    };
    function sign(num){
      if(num < 0){
        return -1;
      }else{
        return 1;
      }
    }


    return headOn;
    function square(num){
      return num * num;
    }
    function isEmpty(obj){
      return Object.keys(obj).length === 0;
    }
  }());
  module.exports = headOn;
  window.headOn = headOn;
})(window);
},{}],"F:\\Programming\\Javascript\\pixel-casino\\node_modules\\q\\q.js":[function(require,module,exports){
(function (process){
// vim:ts=4:sts=4:sw=4:
/*!
 *
 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
 *
 * With parts by Tyler Close
 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
 * at http://www.opensource.org/licenses/mit-license.html
 * Forked at ref_send.js version: 2009-05-11
 *
 * With parts by Mark Miller
 * Copyright (C) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function (definition) {
    // Turn off strict mode for this function so we can assign to global.Q
    /* jshint strict: false */

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the Q API and when
    // executed as a simple <script>, it creates a Q global instead.

    // Montage Require
    if (typeof bootstrap === "function") {
        bootstrap("promise", definition);

    // CommonJS
    } else if (typeof exports === "object") {
        module.exports = definition();

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);

    // SES (Secure EcmaScript)
    } else if (typeof ses !== "undefined") {
        if (!ses.ok()) {
            return;
        } else {
            ses.makeQ = definition;
        }

    // <script>
    } else {
        Q = definition();
    }

})(function () {
"use strict";

var hasStacks = false;
try {
    throw new Error();
} catch (e) {
    hasStacks = !!e.stack;
}

// All code after this point will be filtered from stack traces reported
// by Q.
var qStartingLine = captureLine();
var qFileName;

// shims

// used for fallback in "allResolved"
var noop = function () {};

// Use the fastest possible means to execute a task in a future turn
// of the event loop.
var nextTick =(function () {
    // linked list of tasks (single, with head node)
    var head = {task: void 0, next: null};
    var tail = head;
    var flushing = false;
    var requestTick = void 0;
    var isNodeJS = false;

    function flush() {
        /* jshint loopfunc: true */

        while (head.next) {
            head = head.next;
            var task = head.task;
            head.task = void 0;
            var domain = head.domain;

            if (domain) {
                head.domain = void 0;
                domain.enter();
            }

            try {
                task();

            } catch (e) {
                if (isNodeJS) {
                    // In node, uncaught exceptions are considered fatal errors.
                    // Re-throw them synchronously to interrupt flushing!

                    // Ensure continuation if the uncaught exception is suppressed
                    // listening "uncaughtException" events (as domains does).
                    // Continue in next event to avoid tick recursion.
                    if (domain) {
                        domain.exit();
                    }
                    setTimeout(flush, 0);
                    if (domain) {
                        domain.enter();
                    }

                    throw e;

                } else {
                    // In browsers, uncaught exceptions are not fatal.
                    // Re-throw them asynchronously to avoid slow-downs.
                    setTimeout(function() {
                       throw e;
                    }, 0);
                }
            }

            if (domain) {
                domain.exit();
            }
        }

        flushing = false;
    }

    nextTick = function (task) {
        tail = tail.next = {
            task: task,
            domain: isNodeJS && process.domain,
            next: null
        };

        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };

    if (typeof process !== "undefined" && process.nextTick) {
        // Node.js before 0.9. Note that some fake-Node environments, like the
        // Mocha test runner, introduce a `process` global without a `nextTick`.
        isNodeJS = true;

        requestTick = function () {
            process.nextTick(flush);
        };

    } else if (typeof setImmediate === "function") {
        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
        if (typeof window !== "undefined") {
            requestTick = setImmediate.bind(window, flush);
        } else {
            requestTick = function () {
                setImmediate(flush);
            };
        }

    } else if (typeof MessageChannel !== "undefined") {
        // modern browsers
        // http://www.nonblocking.io/2011/06/windownexttick.html
        var channel = new MessageChannel();
        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
        // working message ports the first time a page loads.
        channel.port1.onmessage = function () {
            requestTick = requestPortTick;
            channel.port1.onmessage = flush;
            flush();
        };
        var requestPortTick = function () {
            // Opera requires us to provide a message payload, regardless of
            // whether we use it.
            channel.port2.postMessage(0);
        };
        requestTick = function () {
            setTimeout(flush, 0);
            requestPortTick();
        };

    } else {
        // old browsers
        requestTick = function () {
            setTimeout(flush, 0);
        };
    }

    return nextTick;
})();

// Attempt to make generics safe in the face of downstream
// modifications.
// There is no situation where this is necessary.
// If you need a security guarantee, these primordials need to be
// deeply frozen anyway, and if you don’t need a security guarantee,
// this is just plain paranoid.
// However, this **might** have the nice side-effect of reducing the size of
// the minified code by reducing x.call() to merely x()
// See Mark Miller’s explanation of what this does.
// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
var call = Function.call;
function uncurryThis(f) {
    return function () {
        return call.apply(f, arguments);
    };
}
// This is equivalent, but slower:
// uncurryThis = Function_bind.bind(Function_bind.call);
// http://jsperf.com/uncurrythis

var array_slice = uncurryThis(Array.prototype.slice);

var array_reduce = uncurryThis(
    Array.prototype.reduce || function (callback, basis) {
        var index = 0,
            length = this.length;
        // concerning the initial value, if one is not provided
        if (arguments.length === 1) {
            // seek to the first value in the array, accounting
            // for the possibility that is is a sparse array
            do {
                if (index in this) {
                    basis = this[index++];
                    break;
                }
                if (++index >= length) {
                    throw new TypeError();
                }
            } while (1);
        }
        // reduce
        for (; index < length; index++) {
            // account for the possibility that the array is sparse
            if (index in this) {
                basis = callback(basis, this[index], index);
            }
        }
        return basis;
    }
);

var array_indexOf = uncurryThis(
    Array.prototype.indexOf || function (value) {
        // not a very good shim, but good enough for our one use of it
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }
);

var array_map = uncurryThis(
    Array.prototype.map || function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    }
);

var object_create = Object.create || function (prototype) {
    function Type() { }
    Type.prototype = prototype;
    return new Type();
};

var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

var object_keys = Object.keys || function (object) {
    var keys = [];
    for (var key in object) {
        if (object_hasOwnProperty(object, key)) {
            keys.push(key);
        }
    }
    return keys;
};

var object_toString = uncurryThis(Object.prototype.toString);

function isObject(value) {
    return value === Object(value);
}

// generator related shims

// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
function isStopIteration(exception) {
    return (
        object_toString(exception) === "[object StopIteration]" ||
        exception instanceof QReturnValue
    );
}

// FIXME: Remove this helper and Q.return once ES6 generators are in
// SpiderMonkey.
var QReturnValue;
if (typeof ReturnValue !== "undefined") {
    QReturnValue = ReturnValue;
} else {
    QReturnValue = function (value) {
        this.value = value;
    };
}

// long stack traces

var STACK_JUMP_SEPARATOR = "From previous event:";

function makeStackTraceLong(error, promise) {
    // If possible, transform the error stack trace by removing Node and Q
    // cruft, then concatenating with the stack trace of `promise`. See #57.
    if (hasStacks &&
        promise.stack &&
        typeof error === "object" &&
        error !== null &&
        error.stack &&
        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
    ) {
        var stacks = [];
        for (var p = promise; !!p; p = p.source) {
            if (p.stack) {
                stacks.unshift(p.stack);
            }
        }
        stacks.unshift(error.stack);

        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
        error.stack = filterStackString(concatedStacks);
    }
}

function filterStackString(stackString) {
    var lines = stackString.split("\n");
    var desiredLines = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];

        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
            desiredLines.push(line);
        }
    }
    return desiredLines.join("\n");
}

function isNodeFrame(stackLine) {
    return stackLine.indexOf("(module.js:") !== -1 ||
           stackLine.indexOf("(node.js:") !== -1;
}

function getFileNameAndLineNumber(stackLine) {
    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
    // In IE10 function name can have spaces ("Anonymous function") O_o
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
    if (attempt1) {
        return [attempt1[1], Number(attempt1[2])];
    }

    // Anonymous functions: "at filename:lineNumber:columnNumber"
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
    if (attempt2) {
        return [attempt2[1], Number(attempt2[2])];
    }

    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
    if (attempt3) {
        return [attempt3[1], Number(attempt3[2])];
    }
}

function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

    if (!fileNameAndLineNumber) {
        return false;
    }

    var fileName = fileNameAndLineNumber[0];
    var lineNumber = fileNameAndLineNumber[1];

    return fileName === qFileName &&
        lineNumber >= qStartingLine &&
        lineNumber <= qEndingLine;
}

// discover own file name and line number range for filtering stack
// traces
function captureLine() {
    if (!hasStacks) {
        return;
    }

    try {
        throw new Error();
    } catch (e) {
        var lines = e.stack.split("\n");
        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
        if (!fileNameAndLineNumber) {
            return;
        }

        qFileName = fileNameAndLineNumber[0];
        return fileNameAndLineNumber[1];
    }
}

function deprecate(callback, name, alternative) {
    return function () {
        if (typeof console !== "undefined" &&
            typeof console.warn === "function") {
            console.warn(name + " is deprecated, use " + alternative +
                         " instead.", new Error("").stack);
        }
        return callback.apply(callback, arguments);
    };
}

// end of shims
// beginning of real work

/**
 * Constructs a promise for an immediate reference, passes promises through, or
 * coerces promises from different systems.
 * @param value immediate reference or promise
 */
function Q(value) {
    // If the object is already a Promise, return it directly.  This enables
    // the resolve function to both be used to created references from objects,
    // but to tolerably coerce non-promises to promises.
    if (isPromise(value)) {
        return value;
    }

    // assimilate thenables
    if (isPromiseAlike(value)) {
        return coerce(value);
    } else {
        return fulfill(value);
    }
}
Q.resolve = Q;

/**
 * Performs a task in a future turn of the event loop.
 * @param {Function} task
 */
Q.nextTick = nextTick;

/**
 * Controls whether or not long stack traces will be on
 */
Q.longStackSupport = false;

/**
 * Constructs a {promise, resolve, reject} object.
 *
 * `resolve` is a callback to invoke with a more resolved value for the
 * promise. To fulfill the promise, invoke `resolve` with any value that is
 * not a thenable. To reject the promise, invoke `resolve` with a rejected
 * thenable, or invoke `reject` with the reason directly. To resolve the
 * promise to another thenable, thus putting it in the same state, invoke
 * `resolve` with that other thenable.
 */
Q.defer = defer;
function defer() {
    // if "messages" is an "Array", that indicates that the promise has not yet
    // been resolved.  If it is "undefined", it has been resolved.  Each
    // element of the messages array is itself an array of complete arguments to
    // forward to the resolved promise.  We coerce the resolution value to a
    // promise using the `resolve` function because it handles both fully
    // non-thenable values and other thenables gracefully.
    var messages = [], progressListeners = [], resolvedPromise;

    var deferred = object_create(defer.prototype);
    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, operands) {
        var args = array_slice(arguments);
        if (messages) {
            messages.push(args);
            if (op === "when" && operands[1]) { // progress operand
                progressListeners.push(operands[1]);
            }
        } else {
            nextTick(function () {
                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
            });
        }
    };

    // XXX deprecated
    promise.valueOf = function () {
        if (messages) {
            return promise;
        }
        var nearerValue = nearer(resolvedPromise);
        if (isPromise(nearerValue)) {
            resolvedPromise = nearerValue; // shorten chain
        }
        return nearerValue;
    };

    promise.inspect = function () {
        if (!resolvedPromise) {
            return { state: "pending" };
        }
        return resolvedPromise.inspect();
    };

    if (Q.longStackSupport && hasStacks) {
        try {
            throw new Error();
        } catch (e) {
            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
            // accessor around; that causes memory leaks as per GH-111. Just
            // reify the stack trace as a string ASAP.
            //
            // At the same time, cut off the first line; it's always just
            // "[object Promise]\n", as per the `toString`.
            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
        }
    }

    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
    // consolidating them into `become`, since otherwise we'd create new
    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

    function become(newPromise) {
        resolvedPromise = newPromise;
        promise.source = newPromise;

        array_reduce(messages, function (undefined, message) {
            nextTick(function () {
                newPromise.promiseDispatch.apply(newPromise, message);
            });
        }, void 0);

        messages = void 0;
        progressListeners = void 0;
    }

    deferred.promise = promise;
    deferred.resolve = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(Q(value));
    };

    deferred.fulfill = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(fulfill(value));
    };
    deferred.reject = function (reason) {
        if (resolvedPromise) {
            return;
        }

        become(reject(reason));
    };
    deferred.notify = function (progress) {
        if (resolvedPromise) {
            return;
        }

        array_reduce(progressListeners, function (undefined, progressListener) {
            nextTick(function () {
                progressListener(progress);
            });
        }, void 0);
    };

    return deferred;
}

/**
 * Creates a Node-style callback that will resolve or reject the deferred
 * promise.
 * @returns a nodeback
 */
defer.prototype.makeNodeResolver = function () {
    var self = this;
    return function (error, value) {
        if (error) {
            self.reject(error);
        } else if (arguments.length > 2) {
            self.resolve(array_slice(arguments, 1));
        } else {
            self.resolve(value);
        }
    };
};

/**
 * @param resolver {Function} a function that returns nothing and accepts
 * the resolve, reject, and notify functions for a deferred.
 * @returns a promise that may be resolved with the given resolve and reject
 * functions, or rejected by a thrown exception in resolver
 */
Q.Promise = promise; // ES6
Q.promise = promise;
function promise(resolver) {
    if (typeof resolver !== "function") {
        throw new TypeError("resolver must be a function.");
    }
    var deferred = defer();
    try {
        resolver(deferred.resolve, deferred.reject, deferred.notify);
    } catch (reason) {
        deferred.reject(reason);
    }
    return deferred.promise;
}

promise.race = race; // ES6
promise.all = all; // ES6
promise.reject = reject; // ES6
promise.resolve = Q; // ES6

// XXX experimental.  This method is a way to denote that a local value is
// serializable and should be immediately dispatched to a remote upon request,
// instead of passing a reference.
Q.passByCopy = function (object) {
    //freeze(object);
    //passByCopies.set(object, true);
    return object;
};

Promise.prototype.passByCopy = function () {
    //freeze(object);
    //passByCopies.set(object, true);
    return this;
};

/**
 * If two promises eventually fulfill to the same value, promises that value,
 * but otherwise rejects.
 * @param x {Any*}
 * @param y {Any*}
 * @returns {Any*} a promise for x and y if they are the same, but a rejection
 * otherwise.
 *
 */
Q.join = function (x, y) {
    return Q(x).join(y);
};

Promise.prototype.join = function (that) {
    return Q([this, that]).spread(function (x, y) {
        if (x === y) {
            // TODO: "===" should be Object.is or equiv
            return x;
        } else {
            throw new Error("Can't join: not the same: " + x + " " + y);
        }
    });
};

/**
 * Returns a promise for the first of an array of promises to become fulfilled.
 * @param answers {Array[Any*]} promises to race
 * @returns {Any*} the first promise to be fulfilled
 */
Q.race = race;
function race(answerPs) {
    return promise(function(resolve, reject) {
        // Switch to this once we can assume at least ES5
        // answerPs.forEach(function(answerP) {
        //     Q(answerP).then(resolve, reject);
        // });
        // Use this in the meantime
        for (var i = 0, len = answerPs.length; i < len; i++) {
            Q(answerPs[i]).then(resolve, reject);
        }
    });
}

Promise.prototype.race = function () {
    return this.then(Q.race);
};

/**
 * Constructs a Promise with a promise descriptor object and optional fallback
 * function.  The descriptor contains methods like when(rejected), get(name),
 * set(name, value), post(name, args), and delete(name), which all
 * return either a value, a promise for a value, or a rejection.  The fallback
 * accepts the operation name, a resolver, and any further arguments that would
 * have been forwarded to the appropriate method above had a method been
 * provided with the proper name.  The API makes no guarantees about the nature
 * of the returned object, apart from that it is usable whereever promises are
 * bought and sold.
 */
Q.makePromise = Promise;
function Promise(descriptor, fallback, inspect) {
    if (fallback === void 0) {
        fallback = function (op) {
            return reject(new Error(
                "Promise does not support operation: " + op
            ));
        };
    }
    if (inspect === void 0) {
        inspect = function () {
            return {state: "unknown"};
        };
    }

    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, args) {
        var result;
        try {
            if (descriptor[op]) {
                result = descriptor[op].apply(promise, args);
            } else {
                result = fallback.call(promise, op, args);
            }
        } catch (exception) {
            result = reject(exception);
        }
        if (resolve) {
            resolve(result);
        }
    };

    promise.inspect = inspect;

    // XXX deprecated `valueOf` and `exception` support
    if (inspect) {
        var inspected = inspect();
        if (inspected.state === "rejected") {
            promise.exception = inspected.reason;
        }

        promise.valueOf = function () {
            var inspected = inspect();
            if (inspected.state === "pending" ||
                inspected.state === "rejected") {
                return promise;
            }
            return inspected.value;
        };
    }

    return promise;
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.then = function (fulfilled, rejected, progressed) {
    var self = this;
    var deferred = defer();
    var done = false;   // ensure the untrusted promise makes at most a
                        // single call to one of the callbacks

    function _fulfilled(value) {
        try {
            return typeof fulfilled === "function" ? fulfilled(value) : value;
        } catch (exception) {
            return reject(exception);
        }
    }

    function _rejected(exception) {
        if (typeof rejected === "function") {
            makeStackTraceLong(exception, self);
            try {
                return rejected(exception);
            } catch (newException) {
                return reject(newException);
            }
        }
        return reject(exception);
    }

    function _progressed(value) {
        return typeof progressed === "function" ? progressed(value) : value;
    }

    nextTick(function () {
        self.promiseDispatch(function (value) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_fulfilled(value));
        }, "when", [function (exception) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_rejected(exception));
        }]);
    });

    // Progress propagator need to be attached in the current tick.
    self.promiseDispatch(void 0, "when", [void 0, function (value) {
        var newValue;
        var threw = false;
        try {
            newValue = _progressed(value);
        } catch (e) {
            threw = true;
            if (Q.onerror) {
                Q.onerror(e);
            } else {
                throw e;
            }
        }

        if (!threw) {
            deferred.notify(newValue);
        }
    }]);

    return deferred.promise;
};

/**
 * Registers an observer on a promise.
 *
 * Guarantees:
 *
 * 1. that fulfilled and rejected will be called only once.
 * 2. that either the fulfilled callback or the rejected callback will be
 *    called, but not both.
 * 3. that fulfilled and rejected will not be called in this turn.
 *
 * @param value      promise or immediate reference to observe
 * @param fulfilled  function to be called with the fulfilled value
 * @param rejected   function to be called with the rejection exception
 * @param progressed function to be called on any progress notifications
 * @return promise for the return value from the invoked callback
 */
Q.when = when;
function when(value, fulfilled, rejected, progressed) {
    return Q(value).then(fulfilled, rejected, progressed);
}

Promise.prototype.thenResolve = function (value) {
    return this.then(function () { return value; });
};

Q.thenResolve = function (promise, value) {
    return Q(promise).thenResolve(value);
};

Promise.prototype.thenReject = function (reason) {
    return this.then(function () { throw reason; });
};

Q.thenReject = function (promise, reason) {
    return Q(promise).thenReject(reason);
};

/**
 * If an object is not a promise, it is as "near" as possible.
 * If a promise is rejected, it is as "near" as possible too.
 * If it’s a fulfilled promise, the fulfillment value is nearer.
 * If it’s a deferred promise and the deferred has been resolved, the
 * resolution is "nearer".
 * @param object
 * @returns most resolved (nearest) form of the object
 */

// XXX should we re-do this?
Q.nearer = nearer;
function nearer(value) {
    if (isPromise(value)) {
        var inspected = value.inspect();
        if (inspected.state === "fulfilled") {
            return inspected.value;
        }
    }
    return value;
}

/**
 * @returns whether the given object is a promise.
 * Otherwise it is a fulfilled value.
 */
Q.isPromise = isPromise;
function isPromise(object) {
    return isObject(object) &&
        typeof object.promiseDispatch === "function" &&
        typeof object.inspect === "function";
}

Q.isPromiseAlike = isPromiseAlike;
function isPromiseAlike(object) {
    return isObject(object) && typeof object.then === "function";
}

/**
 * @returns whether the given object is a pending promise, meaning not
 * fulfilled or rejected.
 */
Q.isPending = isPending;
function isPending(object) {
    return isPromise(object) && object.inspect().state === "pending";
}

Promise.prototype.isPending = function () {
    return this.inspect().state === "pending";
};

/**
 * @returns whether the given object is a value or fulfilled
 * promise.
 */
Q.isFulfilled = isFulfilled;
function isFulfilled(object) {
    return !isPromise(object) || object.inspect().state === "fulfilled";
}

Promise.prototype.isFulfilled = function () {
    return this.inspect().state === "fulfilled";
};

/**
 * @returns whether the given object is a rejected promise.
 */
Q.isRejected = isRejected;
function isRejected(object) {
    return isPromise(object) && object.inspect().state === "rejected";
}

Promise.prototype.isRejected = function () {
    return this.inspect().state === "rejected";
};

//// BEGIN UNHANDLED REJECTION TRACKING

// This promise library consumes exceptions thrown in handlers so they can be
// handled by a subsequent promise.  The exceptions get added to this array when
// they are created, and removed when they are handled.  Note that in ES6 or
// shimmed environments, this would naturally be a `Set`.
var unhandledReasons = [];
var unhandledRejections = [];
var trackUnhandledRejections = true;

function resetUnhandledRejections() {
    unhandledReasons.length = 0;
    unhandledRejections.length = 0;

    if (!trackUnhandledRejections) {
        trackUnhandledRejections = true;
    }
}

function trackRejection(promise, reason) {
    if (!trackUnhandledRejections) {
        return;
    }

    unhandledRejections.push(promise);
    if (reason && typeof reason.stack !== "undefined") {
        unhandledReasons.push(reason.stack);
    } else {
        unhandledReasons.push("(no stack) " + reason);
    }
}

function untrackRejection(promise) {
    if (!trackUnhandledRejections) {
        return;
    }

    var at = array_indexOf(unhandledRejections, promise);
    if (at !== -1) {
        unhandledRejections.splice(at, 1);
        unhandledReasons.splice(at, 1);
    }
}

Q.resetUnhandledRejections = resetUnhandledRejections;

Q.getUnhandledReasons = function () {
    // Make a copy so that consumers can't interfere with our internal state.
    return unhandledReasons.slice();
};

Q.stopUnhandledRejectionTracking = function () {
    resetUnhandledRejections();
    trackUnhandledRejections = false;
};

resetUnhandledRejections();

//// END UNHANDLED REJECTION TRACKING

/**
 * Constructs a rejected promise.
 * @param reason value describing the failure
 */
Q.reject = reject;
function reject(reason) {
    var rejection = Promise({
        "when": function (rejected) {
            // note that the error has been handled
            if (rejected) {
                untrackRejection(this);
            }
            return rejected ? rejected(reason) : this;
        }
    }, function fallback() {
        return this;
    }, function inspect() {
        return { state: "rejected", reason: reason };
    });

    // Note that the reason has not been handled.
    trackRejection(rejection, reason);

    return rejection;
}

/**
 * Constructs a fulfilled promise for an immediate reference.
 * @param value immediate reference
 */
Q.fulfill = fulfill;
function fulfill(value) {
    return Promise({
        "when": function () {
            return value;
        },
        "get": function (name) {
            return value[name];
        },
        "set": function (name, rhs) {
            value[name] = rhs;
        },
        "delete": function (name) {
            delete value[name];
        },
        "post": function (name, args) {
            // Mark Miller proposes that post with no name should apply a
            // promised function.
            if (name === null || name === void 0) {
                return value.apply(void 0, args);
            } else {
                return value[name].apply(value, args);
            }
        },
        "apply": function (thisp, args) {
            return value.apply(thisp, args);
        },
        "keys": function () {
            return object_keys(value);
        }
    }, void 0, function inspect() {
        return { state: "fulfilled", value: value };
    });
}

/**
 * Converts thenables to Q promises.
 * @param promise thenable promise
 * @returns a Q promise
 */
function coerce(promise) {
    var deferred = defer();
    nextTick(function () {
        try {
            promise.then(deferred.resolve, deferred.reject, deferred.notify);
        } catch (exception) {
            deferred.reject(exception);
        }
    });
    return deferred.promise;
}

/**
 * Annotates an object such that it will never be
 * transferred away from this process over any promise
 * communication channel.
 * @param object
 * @returns promise a wrapping of that object that
 * additionally responds to the "isDef" message
 * without a rejection.
 */
Q.master = master;
function master(object) {
    return Promise({
        "isDef": function () {}
    }, function fallback(op, args) {
        return dispatch(object, op, args);
    }, function () {
        return Q(object).inspect();
    });
}

/**
 * Spreads the values of a promised array of arguments into the
 * fulfillment callback.
 * @param fulfilled callback that receives variadic arguments from the
 * promised array
 * @param rejected callback that receives the exception if the promise
 * is rejected.
 * @returns a promise for the return value or thrown exception of
 * either callback.
 */
Q.spread = spread;
function spread(value, fulfilled, rejected) {
    return Q(value).spread(fulfilled, rejected);
}

Promise.prototype.spread = function (fulfilled, rejected) {
    return this.all().then(function (array) {
        return fulfilled.apply(void 0, array);
    }, rejected);
};

/**
 * The async function is a decorator for generator functions, turning
 * them into asynchronous generators.  Although generators are only part
 * of the newest ECMAScript 6 drafts, this code does not cause syntax
 * errors in older engines.  This code should continue to work and will
 * in fact improve over time as the language improves.
 *
 * ES6 generators are currently part of V8 version 3.19 with the
 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
 * for longer, but under an older Python-inspired form.  This function
 * works on both kinds of generators.
 *
 * Decorates a generator function such that:
 *  - it may yield promises
 *  - execution will continue when that promise is fulfilled
 *  - the value of the yield expression will be the fulfilled value
 *  - it returns a promise for the return value (when the generator
 *    stops iterating)
 *  - the decorated function returns a promise for the return value
 *    of the generator or the first rejected promise among those
 *    yielded.
 *  - if an error is thrown in the generator, it propagates through
 *    every following yield until it is caught, or until it escapes
 *    the generator function altogether, and is translated into a
 *    rejection for the promise returned by the decorated generator.
 */
Q.async = async;
function async(makeGenerator) {
    return function () {
        // when verb is "send", arg is a value
        // when verb is "throw", arg is an exception
        function continuer(verb, arg) {
            var result;

            // Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
            // engine that has a deployed base of browsers that support generators.
            // However, SM's generators use the Python-inspired semantics of
            // outdated ES6 drafts.  We would like to support ES6, but we'd also
            // like to make it possible to use generators in deployed browsers, so
            // we also support Python-style generators.  At some point we can remove
            // this block.

            if (typeof StopIteration === "undefined") {
                // ES6 Generators
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    return reject(exception);
                }
                if (result.done) {
                    return result.value;
                } else {
                    return when(result.value, callback, errback);
                }
            } else {
                // SpiderMonkey Generators
                // FIXME: Remove this case when SM does ES6 generators.
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    if (isStopIteration(exception)) {
                        return exception.value;
                    } else {
                        return reject(exception);
                    }
                }
                return when(result, callback, errback);
            }
        }
        var generator = makeGenerator.apply(this, arguments);
        var callback = continuer.bind(continuer, "next");
        var errback = continuer.bind(continuer, "throw");
        return callback();
    };
}

/**
 * The spawn function is a small wrapper around async that immediately
 * calls the generator and also ends the promise chain, so that any
 * unhandled errors are thrown instead of forwarded to the error
 * handler. This is useful because it's extremely common to run
 * generators at the top-level to work with libraries.
 */
Q.spawn = spawn;
function spawn(makeGenerator) {
    Q.done(Q.async(makeGenerator)());
}

// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
/**
 * Throws a ReturnValue exception to stop an asynchronous generator.
 *
 * This interface is a stop-gap measure to support generator return
 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
 * generators like Chromium 29, just use "return" in your generator
 * functions.
 *
 * @param value the return value for the surrounding generator
 * @throws ReturnValue exception with the value.
 * @example
 * // ES6 style
 * Q.async(function* () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      return foo + bar;
 * })
 * // Older SpiderMonkey style
 * Q.async(function () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      Q.return(foo + bar);
 * })
 */
Q["return"] = _return;
function _return(value) {
    throw new QReturnValue(value);
}

/**
 * The promised function decorator ensures that any promise arguments
 * are settled and passed as values (`this` is also settled and passed
 * as a value).  It will also ensure that the result of a function is
 * always a promise.
 *
 * @example
 * var add = Q.promised(function (a, b) {
 *     return a + b;
 * });
 * add(Q(a), Q(B));
 *
 * @param {function} callback The function to decorate
 * @returns {function} a function that has been decorated.
 */
Q.promised = promised;
function promised(callback) {
    return function () {
        return spread([this, all(arguments)], function (self, args) {
            return callback.apply(self, args);
        });
    };
}

/**
 * sends a message to a value in a future turn
 * @param object* the recipient
 * @param op the name of the message operation, e.g., "when",
 * @param args further arguments to be forwarded to the operation
 * @returns result {Promise} a promise for the result of the operation
 */
Q.dispatch = dispatch;
function dispatch(object, op, args) {
    return Q(object).dispatch(op, args);
}

Promise.prototype.dispatch = function (op, args) {
    var self = this;
    var deferred = defer();
    nextTick(function () {
        self.promiseDispatch(deferred.resolve, op, args);
    });
    return deferred.promise;
};

/**
 * Gets the value of a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to get
 * @return promise for the property value
 */
Q.get = function (object, key) {
    return Q(object).dispatch("get", [key]);
};

Promise.prototype.get = function (key) {
    return this.dispatch("get", [key]);
};

/**
 * Sets the value of a property in a future turn.
 * @param object    promise or immediate reference for object object
 * @param name      name of property to set
 * @param value     new value of property
 * @return promise for the return value
 */
Q.set = function (object, key, value) {
    return Q(object).dispatch("set", [key, value]);
};

Promise.prototype.set = function (key, value) {
    return this.dispatch("set", [key, value]);
};

/**
 * Deletes a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to delete
 * @return promise for the return value
 */
Q.del = // XXX legacy
Q["delete"] = function (object, key) {
    return Q(object).dispatch("delete", [key]);
};

Promise.prototype.del = // XXX legacy
Promise.prototype["delete"] = function (key) {
    return this.dispatch("delete", [key]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param value     a value to post, typically an array of
 *                  invocation arguments for promises that
 *                  are ultimately backed with `resolve` values,
 *                  as opposed to those backed with URLs
 *                  wherein the posted value can be any
 *                  JSON serializable object.
 * @return promise for the return value
 */
// bound locally because it is used by other methods
Q.mapply = // XXX As proposed by "Redsandro"
Q.post = function (object, name, args) {
    return Q(object).dispatch("post", [name, args]);
};

Promise.prototype.mapply = // XXX As proposed by "Redsandro"
Promise.prototype.post = function (name, args) {
    return this.dispatch("post", [name, args]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param ...args   array of invocation arguments
 * @return promise for the return value
 */
Q.send = // XXX Mark Miller's proposed parlance
Q.mcall = // XXX As proposed by "Redsandro"
Q.invoke = function (object, name /*...args*/) {
    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
};

Promise.prototype.send = // XXX Mark Miller's proposed parlance
Promise.prototype.mcall = // XXX As proposed by "Redsandro"
Promise.prototype.invoke = function (name /*...args*/) {
    return this.dispatch("post", [name, array_slice(arguments, 1)]);
};

/**
 * Applies the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param args      array of application arguments
 */
Q.fapply = function (object, args) {
    return Q(object).dispatch("apply", [void 0, args]);
};

Promise.prototype.fapply = function (args) {
    return this.dispatch("apply", [void 0, args]);
};

/**
 * Calls the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q["try"] =
Q.fcall = function (object /* ...args*/) {
    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
};

Promise.prototype.fcall = function (/*...args*/) {
    return this.dispatch("apply", [void 0, array_slice(arguments)]);
};

/**
 * Binds the promised function, transforming return values into a fulfilled
 * promise and thrown errors into a rejected one.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q.fbind = function (object /*...args*/) {
    var promise = Q(object);
    var args = array_slice(arguments, 1);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};
Promise.prototype.fbind = function (/*...args*/) {
    var promise = this;
    var args = array_slice(arguments);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};

/**
 * Requests the names of the owned properties of a promised
 * object in a future turn.
 * @param object    promise or immediate reference for target object
 * @return promise for the keys of the eventually settled object
 */
Q.keys = function (object) {
    return Q(object).dispatch("keys", []);
};

Promise.prototype.keys = function () {
    return this.dispatch("keys", []);
};

/**
 * Turns an array of promises into a promise for an array.  If any of
 * the promises gets rejected, the whole array is rejected immediately.
 * @param {Array*} an array (or promise for an array) of values (or
 * promises for values)
 * @returns a promise for an array of the corresponding values
 */
// By Mark Miller
// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
Q.all = all;
function all(promises) {
    return when(promises, function (promises) {
        var countDown = 0;
        var deferred = defer();
        array_reduce(promises, function (undefined, promise, index) {
            var snapshot;
            if (
                isPromise(promise) &&
                (snapshot = promise.inspect()).state === "fulfilled"
            ) {
                promises[index] = snapshot.value;
            } else {
                ++countDown;
                when(
                    promise,
                    function (value) {
                        promises[index] = value;
                        if (--countDown === 0) {
                            deferred.resolve(promises);
                        }
                    },
                    deferred.reject,
                    function (progress) {
                        deferred.notify({ index: index, value: progress });
                    }
                );
            }
        }, void 0);
        if (countDown === 0) {
            deferred.resolve(promises);
        }
        return deferred.promise;
    });
}

Promise.prototype.all = function () {
    return all(this);
};

/**
 * Waits for all promises to be settled, either fulfilled or
 * rejected.  This is distinct from `all` since that would stop
 * waiting at the first rejection.  The promise returned by
 * `allResolved` will never be rejected.
 * @param promises a promise for an array (or an array) of promises
 * (or values)
 * @return a promise for an array of promises
 */
Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
function allResolved(promises) {
    return when(promises, function (promises) {
        promises = array_map(promises, Q);
        return when(all(array_map(promises, function (promise) {
            return when(promise, noop, noop);
        })), function () {
            return promises;
        });
    });
}

Promise.prototype.allResolved = function () {
    return allResolved(this);
};

/**
 * @see Promise#allSettled
 */
Q.allSettled = allSettled;
function allSettled(promises) {
    return Q(promises).allSettled();
}

/**
 * Turns an array of promises into a promise for an array of their states (as
 * returned by `inspect`) when they have all settled.
 * @param {Array[Any*]} values an array (or promise for an array) of values (or
 * promises for values)
 * @returns {Array[State]} an array of states for the respective values.
 */
Promise.prototype.allSettled = function () {
    return this.then(function (promises) {
        return all(array_map(promises, function (promise) {
            promise = Q(promise);
            function regardless() {
                return promise.inspect();
            }
            return promise.then(regardless, regardless);
        }));
    });
};

/**
 * Captures the failure of a promise, giving an oportunity to recover
 * with a callback.  If the given promise is fulfilled, the returned
 * promise is fulfilled.
 * @param {Any*} promise for something
 * @param {Function} callback to fulfill the returned promise if the
 * given promise is rejected
 * @returns a promise for the return value of the callback
 */
Q.fail = // XXX legacy
Q["catch"] = function (object, rejected) {
    return Q(object).then(void 0, rejected);
};

Promise.prototype.fail = // XXX legacy
Promise.prototype["catch"] = function (rejected) {
    return this.then(void 0, rejected);
};

/**
 * Attaches a listener that can respond to progress notifications from a
 * promise's originating deferred. This listener receives the exact arguments
 * passed to ``deferred.notify``.
 * @param {Any*} promise for something
 * @param {Function} callback to receive any progress notifications
 * @returns the given promise, unchanged
 */
Q.progress = progress;
function progress(object, progressed) {
    return Q(object).then(void 0, void 0, progressed);
}

Promise.prototype.progress = function (progressed) {
    return this.then(void 0, void 0, progressed);
};

/**
 * Provides an opportunity to observe the settling of a promise,
 * regardless of whether the promise is fulfilled or rejected.  Forwards
 * the resolution to the returned promise when the callback is done.
 * The callback can return a promise to defer completion.
 * @param {Any*} promise
 * @param {Function} callback to observe the resolution of the given
 * promise, takes no arguments.
 * @returns a promise for the resolution of the given promise when
 * ``fin`` is done.
 */
Q.fin = // XXX legacy
Q["finally"] = function (object, callback) {
    return Q(object)["finally"](callback);
};

Promise.prototype.fin = // XXX legacy
Promise.prototype["finally"] = function (callback) {
    callback = Q(callback);
    return this.then(function (value) {
        return callback.fcall().then(function () {
            return value;
        });
    }, function (reason) {
        // TODO attempt to recycle the rejection with "this".
        return callback.fcall().then(function () {
            throw reason;
        });
    });
};

/**
 * Terminates a chain of promises, forcing rejections to be
 * thrown as exceptions.
 * @param {Any*} promise at the end of a chain of promises
 * @returns nothing
 */
Q.done = function (object, fulfilled, rejected, progress) {
    return Q(object).done(fulfilled, rejected, progress);
};

Promise.prototype.done = function (fulfilled, rejected, progress) {
    var onUnhandledError = function (error) {
        // forward to a future turn so that ``when``
        // does not catch it and turn it into a rejection.
        nextTick(function () {
            makeStackTraceLong(error, promise);
            if (Q.onerror) {
                Q.onerror(error);
            } else {
                throw error;
            }
        });
    };

    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
    var promise = fulfilled || rejected || progress ?
        this.then(fulfilled, rejected, progress) :
        this;

    if (typeof process === "object" && process && process.domain) {
        onUnhandledError = process.domain.bind(onUnhandledError);
    }

    promise.then(void 0, onUnhandledError);
};

/**
 * Causes a promise to be rejected if it does not get fulfilled before
 * some milliseconds time out.
 * @param {Any*} promise
 * @param {Number} milliseconds timeout
 * @param {String} custom error message (optional)
 * @returns a promise for the resolution of the given promise if it is
 * fulfilled before the timeout, otherwise rejected.
 */
Q.timeout = function (object, ms, message) {
    return Q(object).timeout(ms, message);
};

Promise.prototype.timeout = function (ms, message) {
    var deferred = defer();
    var timeoutId = setTimeout(function () {
        deferred.reject(new Error(message || "Timed out after " + ms + " ms"));
    }, ms);

    this.then(function (value) {
        clearTimeout(timeoutId);
        deferred.resolve(value);
    }, function (exception) {
        clearTimeout(timeoutId);
        deferred.reject(exception);
    }, deferred.notify);

    return deferred.promise;
};

/**
 * Returns a promise for the given value (or promised value), some
 * milliseconds after it resolved. Passes rejections immediately.
 * @param {Any*} promise
 * @param {Number} milliseconds
 * @returns a promise for the resolution of the given promise after milliseconds
 * time has elapsed since the resolution of the given promise.
 * If the given promise rejects, that is passed immediately.
 */
Q.delay = function (object, timeout) {
    if (timeout === void 0) {
        timeout = object;
        object = void 0;
    }
    return Q(object).delay(timeout);
};

Promise.prototype.delay = function (timeout) {
    return this.then(function (value) {
        var deferred = defer();
        setTimeout(function () {
            deferred.resolve(value);
        }, timeout);
        return deferred.promise;
    });
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided as an array, and returns a promise.
 *
 *      Q.nfapply(FS.readFile, [__filename])
 *      .then(function (content) {
 *      })
 *
 */
Q.nfapply = function (callback, args) {
    return Q(callback).nfapply(args);
};

Promise.prototype.nfapply = function (args) {
    var deferred = defer();
    var nodeArgs = array_slice(args);
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided individually, and returns a promise.
 * @example
 * Q.nfcall(FS.readFile, __filename)
 * .then(function (content) {
 * })
 *
 */
Q.nfcall = function (callback /*...args*/) {
    var args = array_slice(arguments, 1);
    return Q(callback).nfapply(args);
};

Promise.prototype.nfcall = function (/*...args*/) {
    var nodeArgs = array_slice(arguments);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Wraps a NodeJS continuation passing function and returns an equivalent
 * version that returns a promise.
 * @example
 * Q.nfbind(FS.readFile, __filename)("utf-8")
 * .then(console.log)
 * .done()
 */
Q.nfbind =
Q.denodeify = function (callback /*...args*/) {
    var baseArgs = array_slice(arguments, 1);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        Q(callback).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nfbind =
Promise.prototype.denodeify = function (/*...args*/) {
    var args = array_slice(arguments);
    args.unshift(this);
    return Q.denodeify.apply(void 0, args);
};

Q.nbind = function (callback, thisp /*...args*/) {
    var baseArgs = array_slice(arguments, 2);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        function bound() {
            return callback.apply(thisp, arguments);
        }
        Q(bound).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nbind = function (/*thisp, ...args*/) {
    var args = array_slice(arguments, 0);
    args.unshift(this);
    return Q.nbind.apply(void 0, args);
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback with a given array of arguments, plus a provided callback.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param {Array} args arguments to pass to the method; the callback
 * will be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nmapply = // XXX As proposed by "Redsandro"
Q.npost = function (object, name, args) {
    return Q(object).npost(name, args);
};

Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
Promise.prototype.npost = function (name, args) {
    var nodeArgs = array_slice(args || []);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback, forwarding the given variadic arguments, plus a provided
 * callback argument.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param ...args arguments to pass to the method; the callback will
 * be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nsend = // XXX Based on Mark Miller's proposed "send"
Q.nmcall = // XXX Based on "Redsandro's" proposal
Q.ninvoke = function (object, name /*...args*/) {
    var nodeArgs = array_slice(arguments, 2);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
Promise.prototype.ninvoke = function (name /*...args*/) {
    var nodeArgs = array_slice(arguments, 1);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * If a function would like to support both Node continuation-passing-style and
 * promise-returning-style, it can end its internal promise chain with
 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
 * elects to use a nodeback, the result will be sent there.  If they do not
 * pass a nodeback, they will receive the result promise.
 * @param object a result (or a promise for a result)
 * @param {Function} nodeback a Node.js-style callback
 * @returns either the promise or nothing
 */
Q.nodeify = nodeify;
function nodeify(object, nodeback) {
    return Q(object).nodeify(nodeback);
}

Promise.prototype.nodeify = function (nodeback) {
    if (nodeback) {
        this.then(function (value) {
            nextTick(function () {
                nodeback(null, value);
            });
        }, function (error) {
            nextTick(function () {
                nodeback(error);
            });
        });
    } else {
        return this;
    }
};

// All code before this point will be filtered from stack traces.
var qEndingLine = captureLine();

return Q;

});

}).call(this,require('_process'))
},{"_process":"C:\\Users\\Yawmus\\AppData\\Roaming\\npm\\node_modules\\watchify\\node_modules\\browserify\\node_modules\\process\\browser.js"}],"F:\\Programming\\Javascript\\pixel-casino\\src\\config.js":[function(require,module,exports){
(function(){
	var config = {
		NUM_OF_RAYS: 1000
	}

	if(window.DEBUG){
		window.config = config;
	}

	module.exports = config
}())

},{}],"F:\\Programming\\Javascript\\pixel-casino\\src\\engine.js":[function(require,module,exports){
var $h = require("../lib/headOn.js");
var utils = require("./utils.js");
var Q = require("q");
(function(){
	function engine(){
		if ( engine.prototype._singletonInstance ) {
		    return engine.prototype._singletonInstance;
		}
		engine.prototype._singletonInstance = this;
		this.levels = {};
		this.images = {};
		this.everything = {};
		this.loadQueue = [];
		this.NPCS = {};
		this.groups = {};
		this.states = {};
		return this;
	}

	engine.getInstance = function(){
		return engine.prototype._singletonInstance;
	}
	engine.prototype.gameState = {
  		init: function(){
  			console.log(engine.getInstance().states)
    		this.state = engine.getInstance().states.loading;
    		this.state.enter();
    		this.engine = engine.getInstance();
  		},
  		changeState: function(state){
    		if(this.state){
      			this.state.exit();
     			this.pState = this.state;
    		}
	    	this.state = state;
	    	this.state.enter();
  		},
	  	update: function(delta){
	    	this.state.update(this, delta);
	  	},
	  	render: function(canvas){
	    	this.state.render(this, canvas);
	  	}
	};
	engine.prototype.addState = function(name, state){
		this.states[name] = state;
	}
	engine.prototype.init = function(width, height){
		var that = this;
		this.gameState.init();
		this.gameWidth = width;
		this.gameHeight = height;
		this.camera = new $h.Camera(width, height);
		this.mainCanvas = $h.canvas.create("main", width, height, this.camera);
		this.mainCanvas.append("body");

		this.loadEverything().then(function(){
			this.loading = false;
			this.loaded = true;
			$h.events.trigger("assestsLoaded");
		});
		$h.update(function(delta){
			that.gameState.update(that.gameState, delta);
		});
		$h.render(function(){
			that.gameState.render(that.mainCanvas);
		})
		$h.run();
	}
	engine.prototype.registerLevel = function(level) {
		// body...
		var id = utils.UUID();
		level.ID = id;
		this.levels[name] = leveldata;
		this.everything[id] = this.levels[level.name];
	};
	engine.prototype.loadEverything = function(){
		this.loading = true;
		var item;
		var promises = [];
		var p;
		var total = this.loadQueue.length;
		var done = 0;
		for(var i =0; i<total; i++){
			item = this.loadQueue[i];
			if(item.image){
				p = this.doImage(item);
			}else{
				p = this.doOther(item);
			}
			p.then(function(){
				done++;
				$h.events.trigger("percentLoaded", done/total);
			});
			promises.push(p);
		}
		return Q.all(promises);
	}
	engine.prototype.startGameLoop = function(){
		
	};
	engine.prototype.group = function(name, entity){
		var group = this.groups[name] || [];
		if(entity){
			group.push(entity);
		}
		return group;
	};
	engine.prototype.registerNPC = function(npc){
		var id = utils.UUID();
		this.everything[id] = npc;
		this.NPCS[id] = npc;
		return id;
	};
	engine.prototype.doOther = function(item){
		var q = Q.defer();
		var that = this;
		var xhr = new XMLHttpRequest();
		var id = utils.UUID();
		xhr.open("get", item.src, true);
		xhr.onload = function(e){
			that.everything[id] = this.response;
			item.promise.resolve({data:this.response, id:id});
			q.resolve();
		}
		xhr.send();
		return q.promise;
	};
	engine.prototype.getImage = function(name){
		return this.images[name] || this.everything[name] || new Image();
	}
	engine.prototype.doImage = function(item){
		var id = utils.UUID();
		var q = Q.defer();
		var i = new Image();
		i.src = item.src;
		this.everything[id] = i;
		this.images[item.name] = i;
		i.onload = function(){
			q.resolve();
			item.promise.resolve({image:i, id:id});
		}
		return q.promise;
	}
	engine.prototype.load = function(src, content_type){
		var q = Q.defer();
		this.loadQueue.push({src:src, content_type:content_type, promise:q})
		return q.promise;
	};
	engine.prototype.loadImage = function(src, name){
		var q = Q.defer();
		this.loadQueue.push({src:src, image:true, promise:q, name:name});
		return q.promise;
	};
	engine.prototype.loadLevel = function(levelname) {
		var level = this.everything[levelname] || this.levels[levelname];
		this.currentLevel = level;
	};
	var instance = new engine();
	module.exports = engine;
}());
},{"../lib/headOn.js":"F:\\Programming\\Javascript\\pixel-casino\\lib\\headOn.js","./utils.js":"F:\\Programming\\Javascript\\pixel-casino\\src\\utils.js","q":"F:\\Programming\\Javascript\\pixel-casino\\node_modules\\q\\q.js"}],"F:\\Programming\\Javascript\\pixel-casino\\src\\entity.js":[function(require,module,exports){
var $h = require("../lib/headOn.js");
var util = require("./utils");
var engine = require("./engine.js").getInstance();

function Entity(name, x, y){
	this.image = engine.getImage(name);
	this.pos = new $h.Vector(x, y);
	this.id = engine.registerNPC(this);
}

util.Class(Entity, {
	setX: function(x){
		this.pos.x = x;
	},
	setY: function(y){
		this.pos.y = y;
	},
	getX: function(){
		return this.pos.x;
	},
	getY: function(){
		return this.pos.y;
	},
	getID: function(){
		return this.id;
	},
	getImage: function(){
		return this.image;
	}
});

module.exports = Entity
},{"../lib/headOn.js":"F:\\Programming\\Javascript\\pixel-casino\\lib\\headOn.js","./engine.js":"F:\\Programming\\Javascript\\pixel-casino\\src\\engine.js","./utils":"F:\\Programming\\Javascript\\pixel-casino\\src\\utils.js"}],"F:\\Programming\\Javascript\\pixel-casino\\src\\game.js":[function(require,module,exports){
var $h = require("../lib/headOn.js");
var engine = require("./engine.js")();
var Class = require("./utils.js").Class;
var Light = require("./light");
var ray = require("./utils").ray;
var Entity = require("./entity");
var init = require("./init");
init();

var mouse = new $h.Vector(0,0);
var mask = $h.canvas.create("mask", window.innerWidth, window.innerHeight, engine.camera).append("body");
var test = new Entity();
console.log(test.getX());
mask.canvas.canvas.style.position = "absolute";
mask.canvas.canvas.style.top = "0"
mask.canvas.canvas.style.left = "0"
var keys ={};
var player = {
	position: new $h.Vector(50,50),
	angle:0,
	speed: 200,
	render: function(canvas){
		canvas.drawRect(16,16, this.position.x, this.position.y, "blue");
	},
	update: function(delta){
		var a =this.position.sub(mouse);
		this.angle = Math.atan2(a.y, a.x) + Math.PI;
		if(keys[37]){
			
		}
		if(keys[38]){
			this.position.x += Math.cos(this.angle) * (delta/1000) * this.speed;
			this.position.y += Math.sin(this.angle) * (delta/1000) * this.speed;
		}
		if(keys[39]){
			
		}
		if(keys[40]){
			this.position.x -= Math.cos(this.angle) * (delta/1000) * this.speed;
			this.position.y -= Math.sin(this.angle) * (delta/1000) * this.speed;
		}
	}
}
var map = {
	get:function(x,y){
		x = Math.floor(x/this.size);
		y = Math.floor(y/this.size);
		//console.log(x,y);
		if(y>=this.data.length|| x>=this.data[0].length || x<0 || y<0) return -1;
		return this.data[y][x];
	},
	size:16,
	length:26,
	width:30,
	data:[
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1,0,1],
	[1,0,0,0,0,0,0,1,1,0,0,1,0,0,1,0,0,0,0,1,0,1,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,1,0,0,0,0,1,0,1,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,1,0,0,0,1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,1],
	[1,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
	]
}
engine.mainCanvas.drawRect(window.innerWidth, window.innerHeight, 0,0, "black");

var light = new Light(20,50, 300, Math.PI/4, -Math.PI, "rgba(255,255,255,1)");
var plight = new Light(20, 50, 40, Math.PI * 2);
var tileSize = 16;
var mul = 1;

window.addEventListener("mousemove", function(e){
	mouse = new $h.Vector(e.x, e.y);
});
window.addEventListener("keydown", function(e){
	keys[e.which] = true;
});
window.addEventListener("keyup", function(e){
	keys[e.which] = false;
});
$h.run();




},{"../lib/headOn.js":"F:\\Programming\\Javascript\\pixel-casino\\lib\\headOn.js","./engine.js":"F:\\Programming\\Javascript\\pixel-casino\\src\\engine.js","./entity":"F:\\Programming\\Javascript\\pixel-casino\\src\\entity.js","./init":"F:\\Programming\\Javascript\\pixel-casino\\src\\init.js","./light":"F:\\Programming\\Javascript\\pixel-casino\\src\\light.js","./utils":"F:\\Programming\\Javascript\\pixel-casino\\src\\utils.js","./utils.js":"F:\\Programming\\Javascript\\pixel-casino\\src\\utils.js"}],"F:\\Programming\\Javascript\\pixel-casino\\src\\init.js":[function(require,module,exports){
var states = require("./states");
var engine = require("./engine").getInstance();
module.exports = function(){
	engine.addState("loading", states.loading);
	engine.addState("gameplay", states.gameplay);
	engine.loadImage("assets/images/guard.png", "guard");
	engine.load("assets/maps/test_map.json", "json").then(function(img, id){
		console.log(JSON.parse(img.data))
	});
	engine.init(window.innerWidth, window.innerHeight);
}
},{"./engine":"F:\\Programming\\Javascript\\pixel-casino\\src\\engine.js","./states":"F:\\Programming\\Javascript\\pixel-casino\\src\\states.js"}],"F:\\Programming\\Javascript\\pixel-casino\\src\\light.js":[function(require,module,exports){
var $h = require("../lib/headOn");
var ray = require("./utils").ray;
var config = require("./config");
function Light(x, y, radius, sector, angle, color){
	this.position = new $h.Vector(x, y);
	this.radius = radius;
	if(!x || !y || !radius){
		this.render = false;
		console.warn("Lights need x y and radius specified");
	}
	this.sector = sector || Math.PI * 2;
	this.angle = angle || 0;
	this.color = color || "white"
	//this.frame = 0;
}
module.exports = Light;
Light.prototype = {
	render: function(canvas, map){
		if(this.render === false) return;
		var NUM_OF_RAYS = config.NUM_OF_RAYS;
		var ctx = canvas.canvas.ctx;
		var i;
		var s;
		var a = this.angle - (this.sector/2);
		var amt = (this.sector)/NUM_OF_RAYS;
		var p;
		var end;
		var t;
		var p2x;
		var p2y;
		
		//Start a path
		ctx.beginPath();
		ctx.moveTo(this.position.x, this.position.y);
		//Loop through all the angles that the light needs
		//console.log(this, this.position.x, a, this.radius);
		for(i=0; i<NUM_OF_RAYS; i++, a+=amt){
			//find the end point of a line from that angle
			p2x = this.position.x + Math.cos(a) * this.radius;
			p2y = this.position.y + Math.sin(a) * this.radius;
			//go along path to find walls.
			p = ray(this.position.x,this.position.y, p2x, p2y, map);

			if(i===0) end = p;
			//make a line to where it found a wall or the end of the path
			ctx.lineTo(p.x, p.y);
		}
		//if its a full circle we need to end where we started or there will be a small peice missing
		//if it isnt a full circle we need to end where the lights position is so we get a nice cone shape
		if(this.sector === Math.PI * 2){
			ctx.lineTo(end.x,end.y);
		}else{
			ctx.lineTo(this.position.x, this.position.y);
		}
		ctx.fillStyle = this.color;
		ctx.fill();
	}

}
},{"../lib/headOn":"F:\\Programming\\Javascript\\pixel-casino\\lib\\headOn.js","./config":"F:\\Programming\\Javascript\\pixel-casino\\src\\config.js","./utils":"F:\\Programming\\Javascript\\pixel-casino\\src\\utils.js"}],"F:\\Programming\\Javascript\\pixel-casino\\src\\states.js":[function(require,module,exports){
var $h = require("../lib/headOn");
var Class = require("./utils").Class;
var engine = require("./engine").getInstance();
var Entity = require("./entity");
var loading = exports.loading = {
	enter: function(){
		var that = this;
		this.percent = 0;
		$h.events.listen("assestsLoaded", function(){
			that.loaded = true;
		});
		$h.events.listen("percentLoaded", function(p){
			that.percentChange = true;
			that.percent = p;
		});
		this.percentChange = true;
	},
	exit: function(){
	},
	render: function(gameState, canvas){
		if(this.percentChange){
			canvas.drawRect(canvas.width, canvas.height, 0,0, "black");
			canvas.drawText("loading: "+this.percent*100 + "%", canvas.width/2, canvas.height/2, "50px", "white", "center");
			this.percentChange = false;
		}
		
	},
	update: function(gameState, delta){
		if(this.loaded){
			if(!this.once){
				this.once = true;
				setTimeout(function(){
					gameState.changeState(gameplay);
				},2000);
			}
			
		}
	}
};

var gameplay = exports.gameplay = {
	enter: function(){
		this.d = new Entity("guard", 200, 200);
	},
	exit: function(){
	},
	render: function(gameState, canvas){
		canvas.drawRect(canvas.width, canvas.height, 0,0, "purple")
		canvas.drawImage(this.d.image, this.d.pos.x, this.d.pos.y)
	},
	update: function(gamestate, delta){
	}
};

},{"../lib/headOn":"F:\\Programming\\Javascript\\pixel-casino\\lib\\headOn.js","./engine":"F:\\Programming\\Javascript\\pixel-casino\\src\\engine.js","./entity":"F:\\Programming\\Javascript\\pixel-casino\\src\\entity.js","./utils":"F:\\Programming\\Javascript\\pixel-casino\\src\\utils.js"}],"F:\\Programming\\Javascript\\pixel-casino\\src\\utils.js":[function(require,module,exports){
$h = require("../lib/headOn.js");
exports.UUID = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();
exports.debug = function(){
	if(window.DEBUG){
		console.log.call(null, arguments);
	}
	return;
}
exports.ray = function(x0, y0, x1, y1, map){
	var dx = Math.abs(x1-x0);
	var dy = Math.abs(y1-y0);
	var xo = x0;
	var yo = y0;
	var sx = (x0 < x1) ? 1 : -1;
	var sy = (y0 < y1) ? 1 : -1;
	var err = ~~dx-dy;
	x1 = ~~x1;
	y1 = ~~y1;
	 var m
	//console.log(x0,x1,y0,y1)
	 //var count = 0;
	while(true){
	   m = map.get(x0, y0);
	   if(m === 1 || m === -1) break;
	   if (Math.abs(x0-x1) <= 2 && Math.abs(y0-y1) <=2) break;
	   var e2 = 2*err;
	   if (e2 >-dy){ err -= dy; x0  += sx; }
	   if (e2 < dx){ err += dx; y0  += sy;}
	   //count++;
	   //console.log(count);
	   //if(count > 50) break;
	}
	return {x:x0, y:y0};
}

exports.Class = function(constructor, parent, members){
	if(!members){
		members = parent;
		parent = false;
	}

	if(parent){
		$h.inherit(parent, constructor);
	}

	$h.extend(constructor.prototype, members);

}

if (!Object.is) {
  Object.is = function(v1, v2) {
    if (v1 === 0 && v2 === 0) {
      return 1 / v1 === 1 / v2;
    }
    if (v1 !== v1) {
      return v2 !== v2;
    }
    return v1 === v2;
  };
}
},{"../lib/headOn.js":"F:\\Programming\\Javascript\\pixel-casino\\lib\\headOn.js"}]},{},["F:\\Programming\\Javascript\\pixel-casino\\src\\game.js"]);
