'use strict';

/**
  * Resize element height based on window height and a bottom, fixed element height;
  * The bottom element's id must be passed as attribute's value.
  * The element behaves as a vertical spring.
  */

/* global $:false */
app.directive('spring', function ($window) {
  return {
    link: function (scope, element, attrs) {
      var bottomElement = $('body').find('#' + attrs.spring)[0];
      var window = angular.element($window);
      var bottomElementHeight = 0;
      var bottomElementPadding = 3;
      if (typeof bottomElement !== 'undefined') {
        bottomElementHeight = bottomElementPadding + bottomElement.clientHeight;
      }
  
      scope.getWindowHeight = function () {
        return {
          windowHeight: window.innerHeight(),
          topHeight: element[0].offsetTop, // this element offset from top
          bottomHeight: bottomElementHeight
        };
      };
  
      scope.$watch(scope.getWindowHeight, function (newValue/*, oldValue*/) {
        var windowHeightNew = newValue.windowHeight; // full window current height
        var topHeight = newValue.topHeight; // top element height
        var bottomHeight = newValue.bottomHeight; // bottom elements height
        var thisHeightNew = windowHeightNew - (topHeight + bottomHeight); // this element recalculated height
        element.css({ 'height': thisHeightNew });
      }, true);
  
      window.bind('resize', function () {
        scope.$apply();
      });
    }
  };
});

app.directive('showDeviceClass', function ($window) {
  return {
    link: function (scope, element) {
      var window = angular.element($window);

      scope.getWindowWidth = function () {
        return window.width();
      };

      scope.$watch(scope.getWindowWidth, function (newValue) {
        var windowWidth = newValue;
        var deviceClass = 'huge';
        if (windowWidth <= 1200) {
          deviceClass = 'wide';
        }
        if (windowWidth <= 992) {
          deviceClass = 'desktop';
        }
        if (windowWidth <= 768) {
          deviceClass = 'tablet';
        }
        if (windowWidth <= 480) {
          deviceClass = 'phone';
        }
        if (windowWidth <= 320) {
          deviceClass = 'custom';
        }
        element.html(
          '<span style="color:darkgreen;font-style:italic;">' +
          'width: ' + windowWidth + 'px' +
          '&emsp;' +
          'device: ' + deviceClass +
          '&emsp;&emsp;' +

          '</span>'
        );
      }, true);
  
      window.bind('resize', function () {
        scope.$apply();
      });
    },
  };
});