'use strict';

/* jshint unused: false */
var KEYCODE_SHIFT = 16;
var KEYCODE_ALT = 18;
var KEYCODE_CTRL = 11;
var KEYCODE_CAPSLOCK = 20;
var KEYCODE_ENTER = 13;
var KEYCODE_ESCAPE = 27;
var KEYCODE_TAB = 9;
var KEYCODE_BACKSPACE = 8;
var KEYCODE_DELETE = 46;
var KEYCODE_END = 35;
var KEYCODE_FUNCTION_ARROW_LEFT = 37;
var KEYCODE_FUNCTION_ARROW_UP = 38;
var KEYCODE_FUNCTION_ARROW_RIGHT = 39;
var KEYCODE_FUNCTION_ARROW_DOWN = 40;
var KEYCODE_FUNCTION_PAGE_UP = 33;
var KEYCODE_FUNCTION_PAGE_DOWN = 34;
var KEYCODE_FUNCTION_KEY_F1 = 112;
var KEYCODE_FUNCTION_KEY_F2 = 113;
var KEYCODE_FUNCTION_KEY_F3 = 114;
var KEYCODE_FUNCTION_KEY_F4 = 115;
var KEYCODE_FUNCTION_KEY_F5 = 116;
var KEYCODE_FUNCTION_KEY_F6 = 117;
var KEYCODE_FUNCTION_KEY_F7 = 118;
var KEYCODE_FUNCTION_KEY_F8 = 119;
var KEYCODE_FUNCTION_KEY_F9 = 120;
var KEYCODE_FUNCTION_KEY_F10 = 121;
var KEYCODE_FUNCTION_KEY_F11 = 122;
var KEYCODE_FUNCTION_KEY_F12 = 123;

app.directive('keyEnter', function () {
  return function (scope, element, attrs) {
    element.bind('keydown keypress', function (event) {
      if (event.which === KEYCODE_ENTER) {
        scope.$apply(function () {
          scope.$eval(attrs.keyEnter);
        });
        event.preventDefault();
      }
    });
  };
});

app.directive('keyEscape', function () {
  return function (scope, element, attrs) {
    element.bind('keydown keypress', function (event) {
      if (event.which === KEYCODE_ESCAPE) {
        scope.$apply(function () {
          scope.$eval(attrs.keyEscape);
        });
        event.preventDefault();
      }
    });
  };
});

app.directive('keyF1', function () {
  return function (scope, element, attrs) {
    element.bind('keydown keypress', function (event) {
      if (event.which === KEYCODE_FUNCTION_KEY_F1) {
        scope.$apply(function () {
          scope.$eval(attrs.keyF1);
        });
        event.preventDefault();
      }
    });
  };
});