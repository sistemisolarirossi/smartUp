'use strict';

app.directive('navCollapse', function () {
  return {
    restrict: 'A',
    link: function (scope, element/*, attrs*/) {
      var visible = false;

      element.on('show.bs.collapse', function () {
        visible = true;
      });

      element.on('hide.bs.collapse', function () {
        visible = false;
      });

      element.on('click', function(/*event*/) {
        if (visible && 'auto' === element.css('overflow-y')) {
          element.collapse('hide');
        }
      });
    }
  };
});