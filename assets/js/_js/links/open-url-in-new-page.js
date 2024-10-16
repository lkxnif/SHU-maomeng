

(function () {
  'use strict';

  (function (window) {
    window.openURL = openURL;

    function openURL(url) {
      let link = document.createElement('a');
      link.target = "_blank";
      link.href = url;
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    };
  })(window);

})();
