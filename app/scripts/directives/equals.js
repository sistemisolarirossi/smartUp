'use strict';

app.directive('equals', function() {
  return {
    restrict: 'A', // only activate on element attribute
    require: '?ngModel', // get a hold of NgModelController
    link: function(scope, elem, attrs, ngModel) {
      // watch own value and re-validate on change
      scope.$watch(attrs.ngModel, function() {
        validate();
      });

      // observe the other value and re-validate on change
      attrs.$observe('equals', function (/*val*/) {
        validate();
      });

      var validate = function() {
        // values
        var val1 = ngModel ? ngModel.$viewValue : undefined;
        var val2 = attrs.equals;

        // set validity
        ngModel.$setValidity('equals', !(val1 || val2) || (val1 === val2));
      };
    }
  };
});