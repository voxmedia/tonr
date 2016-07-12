(function() {
  var c,
      ctx,
      filters = {
        grayscale: function(){
          var pixels = ctx.getImageData(0,0,c.width,c.height);
          var data = pixels.data;
          for (var i=0; i < data.length; i+=4) {
            var v = 0.2126 * data[i] + 0.7152 * data[i+1] + 0.0722 * data[i+2];
            data[i] = data[i+1] = data[i+2] = v;
          }
          ctx.putImageData(pixels,0,0);
        },
        cottoncandy: function(){
          var gradient = ctx.createLinearGradient(0,0,ctx.canvas.width,ctx.canvas.height);
          gradient.addColorStop(0,"#f86e07");
          gradient.addColorStop(1,"#fac5c5");
          ctx.fillStyle = gradient;
          ctx.globalAlpha = 0.2;
          ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
          ctx.globalAlpha = 1;
        },
        golden: function() {
          var pixels = ctx.getImageData(0,0,c.width,c.height);
          var data = pixels.data;
          for (var i=0; i < data.length; i+=4) {
            data[i] += 35;
            data[i+2] -= 35;
          }
          ctx.putImageData(pixels,0,0);
        }
      };

  /**
   * By Ken Fyrstenberg Nilsen
   * drawImageProp(context, image [, x, y, width, height [,offsetX, offsetY]])
   * If image and context are only arguments rectangle will equal canvas
   * See http://stackoverflow.com/questions/21961839/simulation-background-size-cover-in-canvas
  */
  var drawImageProp = function(ctx, img, x, y, w, h, offsetX, offsetY) {

      if (arguments.length === 2) {
          x = y = 0;
          w = ctx.canvas.width;
          h = ctx.canvas.height;
      }

      // default offset is center
      offsetX = typeof offsetX === "number" ? offsetX : 0.5;
      offsetY = typeof offsetY === "number" ? offsetY : 0.5;

      // keep bounds [0.0, 1.0]
      if (offsetX < 0) offsetX = 0;
      if (offsetY < 0) offsetY = 0;
      if (offsetX > 1) offsetX = 1;
      if (offsetY > 1) offsetY = 1;

      var iw = img.width,
          ih = img.height,
          r = Math.min(w / iw, h / ih),
          nw = iw * r,   // new prop. width
          nh = ih * r,   // new prop. height
          cx, cy, cw, ch, ar = 1;

      // decide which gap to fill    
      if (nw < w) ar = w / nw;                             
      if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh;  // updated
      nw *= ar;
      nh *= ar;

      // calc source rectangle
      cw = iw / (nw / w);
      ch = ih / (nh / h);

      cx = (iw - cw) * offsetX;
      cy = (ih - ch) * offsetY;

      // make sure source rectangle is valid
      if (cx < 0) cx = 0;
      if (cy < 0) cy = 0;
      if (cw > iw) cw = iw;
      if (ch > ih) ch = ih;

      // fill image in dest. rectangle
      ctx.drawImage(img, cx, cy, cw, ch,  x, y, w, h);
  };

  var loadCanvas = function() {
    c = document.getElementById("canvas");
    ctx = c.getContext("2d");
    ctx.fillStyle = "#e6e6e6";
    ctx.fillRect(0,0,c.width,c.height);
  };

  var loadImage = function() {
    var img = document.getElementById("uploaded-img");
    drawImageProp(ctx, img);
  };

  var filterImage = function(filter) {
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
      default:
        console.log('filter not defined');
        break;
    }
  };

  var loadUploader = function() {
    $('#button').on('dragenter', function (e){
      safeTarget(e);
      $(this).addClass('hover');
    });

    $('#button').on('dragleave', function (e){
      safeTarget(e);
      $(this).removeClass('hover');
    });

    $('#button').on('dragover', function (e){
      safeTarget(e);
    });

    $('#button').on('drop', function (e){
      safeTarget(e);
      file = e.originalEvent.dataTransfer.files[0];
      $(this).removeClass('hover');
      fileHandler(file);
    });

    $('#button').click( function(e){
      $('#file-input').click();
      $('#file-input').on('change', function(e){
        file = e.target.files[0];
        fileHandler(file);
        $(this).replaceWith($(this).clone());
      });
    });

    var safeTarget = function(e){
      e.stopPropagation();
      e.preventDefault();
      return false;
    }

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