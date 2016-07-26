$(document).ready(function() {
  if ($('.flash').length > 0) {
    setTimeout(function(){
      $('.flash').fadeOut();
    }, 1500)
  }
  $('.flash span').on('click', function() {
    $(this).parents().find('.flash').fadeOut();
  })
})