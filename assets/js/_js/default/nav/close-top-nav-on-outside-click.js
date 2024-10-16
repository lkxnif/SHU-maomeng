

/* when outside of top nav buttons is clicked, close it. */

(function () {
  'use strict';

  $(function () {
    $(document).click(function (e) {
      var $navbar = $(".top-nav-buttons");
      var _opened = $navbar.hasClass("in");

      if (_opened === true && $(e.target).parents('.top-nav-buttons').length == 0) {
        $navbar.collapse('hide');
      }
    });
  });

})();
