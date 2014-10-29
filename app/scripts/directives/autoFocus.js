'use strict';

app.directive('autofocus', function ($timeout) {
  return {
    replace: false,
    link: function (scope, element, attr) {
      scope.$watch(attr.autofocus,
        function (value) {
          if (value) {
            $timeout(function () {
              element[0].focus();
              console.log(' *** focus called');
            });
          }
        }
      );
    }
  };
});