'use strict';

qianxun.filter('sliceString', function () {
  return function (input, start) {
    if (input) {
      return input.substring(0, start);
    }
  };
});
