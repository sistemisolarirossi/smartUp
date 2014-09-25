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
/*
app.directive('formAutofillFix', function() {
console.info('formAutofillFix');
  return {
    restrict: 'A',
    / *require: 'ngModel',* /
    link: function(scope, elem, attrs/ *, ngModel* /) {
//  return function(scope, elem, attrs) {
    // fixes Chrome bug: https://groups.google.com/forum/#!topic/angular/6NlucSskQjY
    elem.prop('method', 'POST');

    // fixes autofill issues where Angular doesn't know about autofilled inputs
console.info('formAutofillFix attrs', attrs);
    if (attrs.ngSubmit) {
      setTimeout(function() {
        elem.unbind('submit').submit(function(e) {
          e.preventDefault();
          elem.find('input, password, textarea, select').trigger('input').trigger('change').trigger('keydown');
          scope.$apply(attrs.ngSubmit);
        });
      }, 0);
    }
    }
  };
});

app.directive('autoFillSync', function($timeout) {
console.info('autoFillSync');
  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ngModel) {
      var origVal = elem.val();
      $timeout(function () {
        var newVal = elem.val();
        if (ngModel.$pristine && origVal !== newVal) {
          ngModel.$setViewValue(newVal);
        }
      }, 500);
    }
  };
});
*/