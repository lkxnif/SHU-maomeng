

(function () {
  'use strict';

  $(function () {
    let home_heading = $(".home-heading");

    if (home_heading.length > 0) {
      home_heading.hide();
      home_heading.fadeIn("slow");
    }
  });

})();
