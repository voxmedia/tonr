(function() {
  var ctx;
  var loadCanvas = function() {
    var c = document.getElementById("canvas");
    ctx = c.getContext("2d");
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0,0,200,200);
  };

  var loadImage = function() {
    ctx.drawImage(document.getElementById("uploaded-img"), ctx.canvas.width / 2, ctx.canvas.height / 2);
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