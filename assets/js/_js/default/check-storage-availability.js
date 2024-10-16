

(function () {
  'use strict';

  var globals = {
    isLocalStorageAvailable: isLocalStorageAvailable
    , isSessionStorageAvailable: isSessionStorageAvailable
  };

  function isLocalStorageAvailable() {
    return storageAvailable('localStorage');
  }

  function isSessionStorageAvailable() {
    return storageAvailable('sessionStorage');
  }

  function storageAvailable(type) {
    var storage;
    try {
      storage = window[type];
      var x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return false;
    }
  }

  (function (window) {
    window.storageChk = globals;
  })(window);

})();
