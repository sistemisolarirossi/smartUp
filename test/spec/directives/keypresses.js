'use strict';

describe('Keypresses directive', function() {
  var scope;
  var elementEnter, elementEscape, elementKeyF1;
  var KEYCODE_ENTER = 13;
  var KEYCODE_ESCAPE = 27;
  var KEYCODE_FUNCTION_KEY_F1 = 112;

  beforeEach(module('smartUpApp'));
  beforeEach(inject(function($templateCache) {
    $templateCache.put('views/home.html', '<div>home</div>');
  }));

  beforeEach(inject(function($compile, $rootScope) {
    scope = $rootScope.$new();
    scope.enter = false;
    scope.escape = false;
    scope.keyF1 = false;
    elementEnter = angular.element('<input ng-model="enter" type="text" key-enter="{{ enter = true }}">');
    elementEscape = angular.element('<input ng-model="escape" type="text" key-escape="{{ escape = true }}">');
    elementKeyF1 = angular.element('<input ng-model="keyF1" type="text" key-f1="{{ keyF1 = true }}">');
    $compile(elementEnter)(scope);
    $compile(elementEscape)(scope);
    $compile(elementKeyF1)(scope);
    scope.$digest();
  }));

  /* global $:false */
  var triggerKeyDown = function (element, keyCode) {
    var e = $.Event('keydown');
    e.which = keyCode;
    e.keyCode = keyCode;
    $(element).trigger(e);
  };

  it('on key-enter down should set scope enter variable to true', function() {
    triggerKeyDown(elementEnter, KEYCODE_ENTER);
    expect(scope.enter).toBe(true);
  });

  it('on key-escape down should set scope escape variable to true', function() {
    triggerKeyDown(elementEscape, KEYCODE_ESCAPE);
    expect(scope.escape).toBe(true);
  });

  it('on key-F1 down should set scope keyF1 variable to true', function() {
    triggerKeyDown(elementKeyF1, KEYCODE_FUNCTION_KEY_F1);
    expect(scope.keyF1).toBe(true);
  });
});