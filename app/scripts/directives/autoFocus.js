'use strict';

app.directive('autofocus', function ($timeout) {
  return {
    scope: {
      trigger: '=autofocus'
    },
    link: function (scope, element) {
      scope.$watch('trigger',
        function (value) {
          if (value) {
            $timeout(function () {
              element[0].focus();
            });
          }
        }
      );
    }
  };
});