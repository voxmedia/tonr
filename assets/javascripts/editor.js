(function() {
  var c,
      ctx,
      imageUrl,
      downloadable,
      currentFilter,
      helpers = {
        loadPixels: function() {
          var pixels = ctx.getImageData(0,0,c.width,c.height);
          return pixels;
        },
        savePixels: function(pixels) {
          ctx.putImageData(pixels,0,0);
        },
        contrast: function(data, contrast) {
          var factor = ( 259 * (contrast + 255)) / (255 * (259 - contrast) );
          for (var i = 0; i < data.length; i += 4) {
              data[i] = factor * (data[i] - 128) + 128;
              data[i+1] = factor * (data[i+1] - 128) + 128;
              data[i+2] = factor * (data[i+2] - 128) + 128;
          }
          return data;
        },
        brightness: function(data, brightness) {
          for (var i=0; i < data.length; i += 4) {
            data[i] += brightness;
            data[i+1] += brightness;
            data[i+2] += brightness;
          }
          return data
        },
        saturation: function(data, saturation) {
          var luR = 0.3086;
          var luG = 0.6094;
          var luB = 0.0820;

          var az = (1 - saturation)*luR + saturation,
              bz = (1 - saturation)*luG,
              cz = (1 - saturation)*luB,
              dz = (1 - saturation)*luR,
              ez = (1 - saturation)*luG + saturation,
              fz = (1 - saturation)*luB,
              gz = (1 - saturation)*luR,
              hz = (1 - saturation)*luG,
              iz = (1 - saturation)*luB + saturation;

          for (var i = 0; i < data.length; i += 4){
              var red = data[i];
              var green = data[i + 1];
              var blue = data[i + 2];

              var saturatedRed = (az*red + bz*green + cz*blue);
              var saturatedGreen = (dz*red + ez*green + fz*blue);
              var saturateddBlue = (gz*red + hz*green + iz*blue);

              data[i] = saturatedRed;
              data[i + 1] = saturatedGreen;
              data[i + 2] = saturateddBlue;
          }
          return data;
        },
        gradient: function(colorOne, colorTwo, opacity) {
          var gradient = ctx.createLinearGradient(0,0,ctx.canvas.width,ctx.canvas.height);
          gradient.addColorStop(0,colorOne);
          gradient.addColorStop(1,colorTwo);
          ctx.fillStyle = gradient;
          ctx.globalAlpha = opacity;
          ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
          ctx.globalAlpha = 1;
        },
        overlay: function(color, opacity) {
          ctx.fillStyle = color;
          ctx.globalAlpha = opacity;
          ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
          ctx.globalAlpha = 1;
        }
      },
      filters = {
        grayscale: function() {
          var pixels = helpers.loadPixels();
          var data = pixels.data;

          for (var i=0; i < data.length; i+=4) {
            var v = 0.2126 * data[i] + 0.7152 * data[i+1] + 0.0722 * data[i+2];
            data[i] = data[i+1] = data[i+2] = v;
          }

          helpers.savePixels(pixels);
        },
        cottoncandy: function() {
          helpers.gradient("#f86e07", "#fac5c5", 0.2);
        },
        golden: function() {
          var pixels = helpers.loadPixels();
          var data = pixels.data;

          for (var i=0; i < data.length; i+=4) {
            data[i] += 35;
            data[i+2] -= 35;
          }
          
          helpers.savePixels(pixels);
        },
        galore: function() {
          var pixels = helpers.loadPixels();
          var data = pixels.data;

          data = helpers.brightness(data, -14);

          helpers.savePixels(pixels);

          helpers.gradient("#ff3782", "#07e9f1", 0.3);

          pixels = helpers.loadPixels();
          data = pixels.data;

          data = helpers.contrast(data, 15);

          helpers.savePixels(pixels);
        },
        glow: function() {
          helpers.overlay("#ff9c52", 0.3);

          var pixels = helpers.loadPixels();
          var data = pixels.data;

          data = helpers.contrast(data, 48);
          data = helpers.saturation(data, 1.4);

          helpers.savePixels(pixels);
        },
        newyork: function() {
          var pixels = helpers.loadPixels();
          var data = pixels.data;

          data = helpers.brightness(data, 10);

          helpers.savePixels(pixels);

          helpers.overlay("#0646c8", 0.4);

          pixels = helpers.loadPixels();
          data = pixels.data;

          data = helpers.contrast(data, 40);

          helpers.savePixels(pixels);
        },
        oakland: function() {
          var pixels = helpers.loadPixels();
          var data = pixels.data;

          data = helpers.saturation(data, 1.4);

          helpers.savePixels(pixels);

          helpers.overlay("#ff4e4e", 0.4);


          pixels = helpers.loadPixels();
          data = pixels.data;

          data = helpers.contrast(data, 30);

          helpers.savePixels(pixels);
        },
        la: function() {
          var pixels = helpers.loadPixels();
          var data = pixels.data;

          for (var i=0; i < data.length; i+=4) {
            data[i] -= 35;
            data[i+1] -= 35;
            data[i+2] -= 35;
          }

          helpers.savePixels(pixels);

          helpers.gradient("#9600ff", "#ffffff", 0.3);
        }
      };

  var drawImageProp = function(ctx, img, x, y, w, h, offsetX, offsetY) {
    // By Ken Fyrstenberg Nilsen
    // See http://stackoverflow.com/questions/21961839/simulation-background-size-cover-in-canvas

    if (arguments.length === 2) {
        x = y = 0;
        w = ctx.canvas.width;
        h = ctx.canvas.height;
    }

    offsetX = typeof offsetX === "number" ? offsetX : 0.5;
    offsetY = typeof offsetY === "number" ? offsetY : 0.5;

    if (offsetX < 0) offsetX = 0;
    if (offsetY < 0) offsetY = 0;
    if (offsetX > 1) offsetX = 1;
    if (offsetY > 1) offsetY = 1;

    var iw = img.width,
        ih = img.height,
        r = Math.min(w / iw, h / ih),
        nw = iw * r,
        nh = ih * r,
        cx, cy, cw, ch, ar = 1;
  
    if (nw < w) ar = w / nw;                             
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;
    nw *= ar;
    nh *= ar;

    cw = iw / (nw / w);
    ch = ih / (nh / h);

    cx = (iw - cw) * offsetX;
    cy = (ih - ch) * offsetY;

    if (cx < 0) cx = 0;
    if (cy < 0) cy = 0;
    if (cw > iw) cw = iw;
    if (ch > ih) ch = ih;

    ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
  };

  var loadCanvas = function() {
    c = document.getElementById("canvas");
    ctx = c.getContext("2d");
    ctx.canvas.crossOrigin = "Anonymous";
    var img = document.getElementById("default-img");
    drawImageProp(ctx, img);
  };

  var loadImage = function() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    if ($('.m-about').css('display') == 'block') {
      $('.m-about').fadeOut();
    }
    if ($(".m-filter-select").css('display') == 'none') {
      $(".m-filter-select").fadeIn();
    }
    if (!downloadable) {
      $("#download").unbind('click');
      $("#download").fadeIn();
      $("#download").click(function(){
        window.open(c.toDataURL('image/jpeg'));
      });
    }
    var img = document.getElementById("uploaded-img");
    drawImageProp(ctx, img);
  };

  var filterImage = function(filter) {
    loadImage();
    downloadable = true;
    currentFilter = filter;
    switch(filter){
      case "grayscale":
        filters.grayscale();
        break;
      case "cottoncandy":
        filters.cottoncandy();
        break;
      case "golden":
        filters.golden();
        break;
      case "galore":
        filters.galore();
        break;
      case "glow":
        filters.glow();
        break;
      case "newyork":
        filters.newyork();
        break;
      case "oakland":
        filters.oakland();
        break;
      case "la":
        filters.la();
        break;
      default:
        break;
    }
    imageUrl = c.toDataURL("image/jpeg");
  };

  var loadUploader = function() {
    $(document).on('click','#file-input', function(e){
      $(this).on('change', function(e){
        file = e.target.files[0];
        fileHandler(file);
        $(this).replaceWith($(this).clone());
      });
    });

    var fileHandler = function(file){
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function(event) {
        $('#uploaded-img').attr('src',event.target.result);
        loadImage();
      };
    }
  };

  $(document).ready(function(){
    loadCanvas();
    loadUploader();

    $(".m-filter-select__filter").click(function(){
      filterImage($(this).data('filter'));
    });
  });
})();