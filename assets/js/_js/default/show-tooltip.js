

(function () {
  'use strict';

  var globals = {
    showToolTip: showToolTip
  };

  function showToolTip(targetElement, str) {
    if (targetElement === null) return;
    if (!str || str.length === 0) return;
    let elm = $(targetElement);
    /* get current tooltip */
    let oldTooltip = elm.attr('data-original-title');
    /* show immediately */
    elm.attr('data-original-title', str).tooltip('show');
    /* return tooltip to original without showing. */
    elm.attr('data-original-title', oldTooltip);
  }

  (function (window) {
    window.showToolTip = globals.showToolTip;
  })(window);

})();
