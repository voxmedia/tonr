(function() {
  var loadCanvas = function() {
    var c = document.getElementById("tonr-canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "#FF0000";
    ctx.fillRect(0,0,200,200);
  }
  $(document).ready(function(){
    loadCanvas();
  });
})();