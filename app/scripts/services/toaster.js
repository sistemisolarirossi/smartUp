'use strict';

app.factory('Toaster', function ($timeout) {
  toastr.options = {
    'closeButton': false,
    'debug': false,
    'positionClass': 'toast-top-right',
    'onclick': null,
    'showDuration': '300',
    'hideDuration': '1000',
    'timeOut': '3500',
    'extendedTimeOut': '1000',
    'showEasing': 'swing',
    'hideEasing': 'linear',
    'showMethod': 'fadeIn',
    'hideMethod': 'fadeOut'
  };
  var last = [];

  function resetLast(what) {
    last[what] = '';
  }

  function stringify() {
    for (var text = '', i = 0; i < arguments.length; i++) {
      text += (i > 0 ? ' ' : '') + JSON.stringify(arguments[i]);
    }
    return text.replace(/^"/g, '').replace(/"$/g, '').replace(/\\/g, '');
  }

  return {
    success: function () {
      var text = stringify.apply(this, arguments);
      if (last.success !== text) {
        toastr.success(text /*, "success Title"*/);
        $timeout(function() { resetLast('success'); }, toastr.options.timeOut, false);
        last.success = text;
      }
    },
    info: function () {
      var text = stringify.apply(this, arguments);
      if (last.info !== text) {
        toastr.info(text);
        $timeout(function() { resetLast('info'); }, toastr.options.timeOut, false);
        last.info = text;
      }
    },
    warning: function () {
      var text = stringify.apply(this, arguments);
      if (last.warning !== text) {
        toastr.warning(text);
        $timeout(function() { resetLast('warning'); }, toastr.options.timeOut, false);
        last.warning = text;
      }
    },
    error: function () {
      var text = stringify.apply(this, arguments);
      if (last.error !== text) {
        toastr.error(text);
        $timeout(function() { resetLast('error'); }, toastr.options.timeOut, false);
        last.error = text;
      }
    }
  };
});