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
        gradient: function(opacity, colorOne, colorTwo, colorThree) {
          var gradient = ctx.createLinearGradient(0,0,ctx.canvas.width,ctx.canvas.height);

          gradient.addColorStop(0,colorOne);
          if (colorThree) {
            gradient.addColorStop(.5,colorTwo);
            gradient.addColorStop(1,colorThree);
          } else {
            gradient.addColorStop(1,colorTwo);
          }

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
          helpers.gradient(0.2,"#f86e07", "#fac5c5");
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

          helpers.gradient(0.3,"#ff3782", "#07e9f1");

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

          helpers.gradient(0.3, "#9600ff", "#ffffff");
        },
        sorbet: function() {
          helpers.gradient(0.4, "#070264", "#fe58d9", "#fbfaaf");
        },
        cherrybomb: function() {
          helpers.gradient(0.55, "#ff5ac7", "#f31515", "#fffec4");

          var pixels = helpers.loadPixels();
          var data = pixels.data;

          data = helpers.brightness(data, 10);
          data = helpers.contrast(data, -30);

          helpers.savePixels(pixels);
        },
        strut: function() {
          var pixels = helpers.loadPixels();
          var data = pixels.data;

          data = helpers.brightness(data, 10);
          data = helpers.contrast(data, 20);
          data = helpers.saturation(data, 2);

          helpers.savePixels(pixels);

          helpers.gradient(0.2, "#270062", "#f90c70");
        },
        moon: function() {
          helpers.gradient(0.6, "#282828", "#7a7a7a", "#e4e4e4");

          var pixels = helpers.loadPixels();
          var data = pixels.data;

          for (var i=0; i < data.length; i+=4) {
            var v = 0.2126 * data[i] + 0.7152 * data[i+1] + 0.0722 * data[i+2];
            data[i] = data[i+1] = data[i+2] = v;
          }

          data = helpers.brightness(data, -10);
          data = helpers.contrast(data, 70);

          helpers.savePixels(pixels);
        }
      };

  var renderImageCover = function(ctx, img, x, y, w, h, offsetX, offsetY) {
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
    renderImageCover(ctx, img);
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
      // download()
    }
    var img = document.getElementById("uploaded-img");
    renderImageCover(ctx, img);
  };

  var download = function() {
    $(".download").unbind('click');
    $(".download").fadeIn();
    $("#manual-download").click(function(){
      window.open(c.toDataURL('image/jpeg'));
    });
    $('.uploadPicture').on('submit', function(e){
      e.preventDefault();
      $(this).find("input:file").each(function(i, elem) {
        var fileInput    = $(elem);
        var form         = $(fileInput.parents('form:first'));
        console.log(fileInput)
        var submitButton = form.find('button[type="submit"]');
        console.log(submitButton)
        var progressBar  = $("<div class='bar'> AYO</div>");
        var barContainer = $("<div class='progress'></div>").append(progressBar);
        fileInput.after(barContainer);
        fileInput.fileupload({
          fileInput:       fileInput,
          url:             form.data('url'),
          type:            'POST',
          autoUpload:       true,
          formData:         form.data('form-data'),
          paramName:        'file', // S3 does not like nested name fields i.e. name="user[avatar_url]"
          dataType:         'XML',  // S3 returns XML if success_action_status is set to 201
          replaceFileInput: false,
          progressall: function (e, data) {
            var progress = parseInt(data.loaded / data.total * 100, 10);
            progressBar.css('width', progress + '%')
          },
          start: function (e) {
            submitButton.prop('disabled', true);
            console.log('got here')
            progressBar.
              css('background', 'green').
              css('display', 'block').
              css('width', '0%').
              text("Loading...");
          },
          done: function(e, data) {
            submitButton.prop('disabled', false);
            progressBar.text("Uploading done");

            // extract key and generate URL from response
            var key   = $(data.jqXHR.responseXML).find("Key").text();
            var url   = '//' + form.data('host') + '/' + key;

            // create hidden field
            var input = $("<input />", { type:'hidden', name: fileInput.attr('name'), value: url })
            form.append(input);
          },
          fail: function(e, data) {
            submitButton.prop('disabled', false);

            progressBar.
              css("background", "red").
              text("Failed");
          }
        });
      });
    })
  }

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
      case "sorbet":
        filters.sorbet();
        break;
      case "cherrybomb":
        filters.cherrybomb();
        break;
      case "strut":
        filters.strut();
        break;
      case "moon":
        filters.moon();
        break;
      default:
        break;
    }
    imageUrl = c.toDataURL("image/jpeg");
  };

  var loadUploader = function() {
    $(document).on('click','#picture_picture_url', function(e){
      $(this).on('change', function(e){
        console.log(e.target.files)
        file = e.target.files[0];
        fileHandler(file);
        $(this).replaceWith($(this).clone());
      });
    });

    var fileHandler = function(file){
      // var reader = new FileReader();
      // reader.readAsDataURL(file);
      // console.log(reader)
      $('.uploadPicture').find("input:file").each(function(i, elem) {
        var fileInput    = $(elem);
        var form         = $(fileInput.parents('form:first'));
        console.log(fileInput)
        var submitButton = form.find('button[type="submit"]');
        console.log(submitButton)
        var progressBar  = $("<div class='bar'> AYO</div>");
        var barContainer = $("<div class='progress'></div>").append(progressBar);
        fileInput.after(barContainer);
        fileInput.fileupload({
          dataType: 'json',
          done: function (e, data) {
            console.log(data.result.files)
            // $.each(data.result.files, function (index, file) {
            //     $('<p/>').text(file.name).appendTo(document.body);
            //   })
            }
          });
        })
              // fileInput.fileupload({
              //   fileInput:       fileInput,
              //   url:             form.data('url'),
              //   type:            'POST',
              //   autoUpload:       true,
              //   formData:         form.data('form-data'),
              //   paramName:        'file', // S3 does not like nested name fields i.e. name="user[avatar_url]"
              //   dataType:         'XML',  // S3 returns XML if success_action_status is set to 201
              //   replaceFileInput: false,
              //   progressall: function (e, data) {
              //     var progress = parseInt(data.loaded / data.total * 100, 10);
              //     progressBar.css('width', progress + '%')
              //   },
              //   start: function (e) {
              //     submitButton.prop('disabled', true);
              //     console.log('got here')
              //     progressBar.
              //       css('background', 'green').
              //       css('display', 'block').
              //       css('width', '0%').
              //       text("Loading...");
              //   },
              //   done: function(e, data) {
              //     submitButton.prop('disabled', false);
              //     progressBar.text("Uploading done");

              //     // extract key and generate URL from response
              //     var key   = $(data.jqXHR.responseXML).find("Key").text();
              //     var url   = '//' + form.data('host') + '/' + key;

              //     // create hidden field
              //     var input = $("<input />", { type:'hidden', name: fileInput.attr('name'), value: url })
              //     form.append(input);
              //   },
              //   fail: function(e, data) {
              //     submitButton.prop('disabled', false);

              //     progressBar.
              //       css("background", "red").
              //       text("Failed");
              //   }
              // });
            // });
      // reader.onload = function(event) {
      //   $('#uploaded-img').attr('src',event.target.result);
      //   loadImage();
      // };
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