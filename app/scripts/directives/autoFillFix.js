'use strict';

app.directive('autofillFix', function () {
  return {
    require: 'ngModel',
    link: function (scope, element, attrs, ngModel) {
      scope.$on('autofillFix:update', function() {
        ngModel.$setViewValue(element.val());
      });
    }
  };
});