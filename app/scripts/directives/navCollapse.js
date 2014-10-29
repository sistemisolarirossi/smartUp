'use strict';

app.directive('navCollapse', function () {
  return {
    restrict: 'A',
    link: function (scope, element) {
      var visible = false;

      element.on('show.bs.collapse', function () {
        visible = true;
      });

      element.on('hide.bs.collapse', function () {
        visible = false;
      });

      element.on('click', function() {
        if (visible && 'auto' === element.css('overflow-y')) {
          element.collapse('hide');
        }
      });
    }
  };
});