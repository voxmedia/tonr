(function() {
  var c,
      ctx;
  var loadCanvas = function() {
    c = document.getElementById("canvas");
    ctx = c.getContext("2d");
    ctx.fillStyle = "#e6e6e6";
    ctx.fillRect(0,0,c.width,c.height);
  };

  var loadImage = function() {
    var img = document.getElementById("uploaded-img");
    $("#canvas").attr('width',img.width);
    $("#canvas").attr('height',img.height);
 
    var canvasHeight = $("#canvas").height;
    var canvasWidth = $("#canvas").width;

    ctx.clearRect(0,0,c.width, canvasHeight);
    ctx.drawImage(img, 0,0, img.width, img.height, c.width, canvasHeight);
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
  });
})();