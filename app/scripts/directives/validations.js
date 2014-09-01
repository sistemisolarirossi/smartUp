'use strict';

function capitalizeAllWords(text) {
  var words = text.split(' ');
  for (var i = 0; i < words.length; i++) {
    var j = words[i].charAt(0).toUpperCase();
    words[i] = j + words[i].substr(1);
  }
  return words.join(' ');
}

function formatDuration(text) {
  var value = text.replace(/\./g, ':');
  var sepidx = value.indexOf(':');
  if (sepidx >= 0) {
    if (value.substr(sepidx + 1).length <= 1) {
      value = value.substr(0, sepidx + 1) + '0' + value.substr(sepidx + 1);
    }
  } else {
    value += ':00';
  }
  return value;
}

app.directive('checkUserName', function(User) {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, model) {
      var USERNAME_REGEXP = /^[^.$\[\]#\/\s]+$/;
      model.$parsers.unshift(function(viewValue) {
        console.log('User.findByUsername(viewValue):', User.findByUsername(viewValue));
        if (USERNAME_REGEXP.test(viewValue)) {
          if (/*!scope.addMode || */User.findByUsername(viewValue).$getIndex().length === 0) {
            model.$setValidity('taken', true);
            model.$setValidity('invalid', true);
            return viewValue;
          } else {
            model.$setValidity('taken', false);
            model.$setValidity('invalid', true);
            return undefined;
          }
        } else {
          model.$setValidity('taken', true);
          model.$setValidity('invalid', viewValue === '');
          return undefined;
        }
      });
      elm.bind('blur', function() {
        if (model.$viewValue) { // capitalize all words in value
          model.$viewValue = capitalizeAllWords(model.$viewValue);
          model.$render();
        }
      });
    }
  };
});

app.directive('checkDuration', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, model) {
      var POSITIVE_INTEGER_REGEXP = /^\d+$/;
      var DURATION_REGEXP = /^\d+[:.]\d+$/;
      model.$parsers.unshift(function(viewValue) {
        var hh = -1;
        var mm = -1;
        if (POSITIVE_INTEGER_REGEXP.test(viewValue)) {
          hh = parseInt(viewValue);
          mm = 0;
        } else {
          if (DURATION_REGEXP.test(viewValue)) {
            var hhmm = viewValue.split(/\s*[:.]\s*/);
            hh = parseInt(hhmm[0]);
            mm = parseInt(hhmm[1]);
            if (mm >= 60) {
              hh = mm = -1;
            }
          }
        }
        var m = (hh * 60) + mm;
        if (m > 0) { // it is valid, set it and return viewValue
          model.$setValidity('duration', true);
          return viewValue;
        } else {
          // it is invalid, return undefined (no model update)
          model.$setValidity('duration', false);
          return undefined;
        }
      });
      elm.bind('blur', function() {
        if (model.$viewValue) { // capitalize all words in value
          model.$viewValue = formatDuration(model.$viewValue);
          model.$render();
        }
      });
    }
  };
});

app.directive('checkCustomerName', function(Customer) {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, model) {
      //var CUSTOMERNAME_REGEXP = /^[^\[\]\{\}\/#]+$/; // TODO: find a better regexp...
      var CUSTOMERNAME_REGEXP = /^([ \u00c0-\u01ffa-zA-Z'\-])+$/;
      var retval;
      model.$parsers.unshift(function(viewValue) {
        if (CUSTOMERNAME_REGEXP.test(viewValue)) {
          var current = attrs.customerId;
          var exists = Customer.findByName(viewValue);
          if (exists && exists !== current) { // customer name exists
            model.$setValidity('taken', false);
            model.$setValidity('invalid', true);
          } else { // customer name does not exist
            model.$setValidity('taken', true);
            model.$setValidity('invalid', true);
            retval = viewValue;
          }
        } else { // customer name is not valid
          model.$setValidity('taken', true);
          model.$setValidity('invalid', false);
        }
        return retval;
      });
      elm.bind('blur', function() {
        if (model.$viewValue) { // capitalize all words in value
          model.$viewValue = capitalizeAllWords(model.$viewValue);
          model.$render();
        }
      });
    }
  };
});

app.directive('checkEmail', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, model) {
      var EMAIL_REGEXP = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
      model.$parsers.unshift(function(viewValue) {
        if (EMAIL_REGEXP.test(viewValue)) {
          model.$setValidity('invalid', true);
          return viewValue;
        } else {
          model.$setValidity('invalid', false);
          return undefined;
        }
      });
      elm.bind('blur', function() {
        if (model.$viewValue) { // lowercase value
          model.$viewValue = model.$viewValue.toLowerCase();
          model.$render();
        }
      });
    }
  };
});

app.directive('checkPassword', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, model) {
      model.$parsers.unshift(function(viewValue) {
        // TODO: better check password strength
        console.info('viewValue:', viewValue);
        if (viewValue.length >= 8) {
          model.$setValidity('invalid', true);
          return viewValue;
        } else {
          model.$setValidity('invalid', false);
          return undefined;
        }
      });
    }
  };
});

app.directive('checkPhone', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, model) {
      var PHONE_REGEXP = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/;
      //var PHONE_REGEXP = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
      var retval;
      model.$parsers.unshift(function(viewValue) {
        if (PHONE_REGEXP.test(viewValue)) {
          model.$setValidity('invalid', true);
          retval = viewValue;
        } else {
          model.$setValidity('invalid', false);
        }
        return retval;
      });
      elm.bind('blur', function() {
        var value = model.$viewValue;
        if (value) { // remove all non-digits and insert one space after mobile prefix
          var mobilePrefixStartsWith = '3';
          var mobilePrefixLength = 3;
          if (value.length > mobilePrefixLength && value.substr(0, 1) === mobilePrefixStartsWith) {
            value = value.replace(/[^0-9]/g, '');
            value = [value.slice(0, mobilePrefixLength), ' ', value.slice(mobilePrefixLength)].join('');
            model.$viewValue = value;
            model.$render();
          } else { // do not reformat non-mobile numbers
          }
        } else { // do not reformat empty values
        }
      });
    }
  };
});

app.directive('checkCfOrPiva', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, model) {
      var CF_LENGTH = 16;
      var PIVA_LENGTH = 11;
      model.$parsers.unshift(function(viewValue) {
        var error = null;
        var retval;
        var valid, i, c, s;
        if (!viewValue || (viewValue.length !== CF_LENGTH && viewValue.length !== PIVA_LENGTH)) { // can't tell if this was a CF or PIVA
          error = 'norCfNorPiva';
        } else {
          if (viewValue.length === CF_LENGTH) { // user is probably inserting a CF
            viewValue = viewValue.toUpperCase();
            valid = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            for (i = 0; i < 16; i++) {
              if (valid.indexOf(viewValue.charAt(i)) === -1) {
                error = 'cfinvalidchar';
                break;
              }
            }
            if (!error) { // validity check of chars passed
              var set1 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
              var set2 = 'ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ';
              var seteven = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
              var setodd = 'BAKPLCQDREVOSFTGUHMINJWZYX';
              s = 0;
              for (i = 1; i <= 13; i += 2) {
                s += seteven.indexOf(set2.charAt(set1.indexOf(viewValue.charAt(i))));
              }
              for (i = 0; i <= 14; i += 2) {
                s += setodd.indexOf(set2.charAt(set1.indexOf(viewValue.charAt(i))));
              }
              if (s % 26 !== viewValue.charCodeAt(15) - 'A'.charCodeAt(0)) {
                error = 'cfcrcwrong';
              }
            }
          }
          if (viewValue.length === PIVA_LENGTH) { // user is probably inserting a PIVA
            valid = '0123456789';
            for (i = 0; i < 11; i++) {
              if (valid.indexOf(viewValue.charAt(i)) === -1) {
                error = 'pivainvalidchar';
                break;
              }
            }
            s = 0;
            for (i = 0; i <= 9; i += 2) {
              s += viewValue.charCodeAt(i) - '0'.charCodeAt(0);
            }
            for (i = 1; i <= 9; i += 2) {
              c = 2 * (viewValue.charCodeAt(i) - '0'.charCodeAt(0));
              if (c > 9) {
                c = c - 9;
              }
              s += c;
            }
            if ((10 - s % 10) % 10 !== viewValue.charCodeAt(10) - '0'.charCodeAt(0)) {
              error = 'pivacrcwrong';
            }
          }
        }
        if (error) {
          model.$setValidity(error, false);
        } else {
          model.$setValidity('norCfNorPiva', true);
          model.$setValidity('cfinvalidchar', true);
          model.$setValidity('cfcrcwrong', true);
          model.$setValidity('pivainvalidchar', true);
          model.$setValidity('pivacrcwrong', true);
          retval = viewValue;
        }
        return retval;
      });
      elm.bind('blur', function() {
        if (model.$viewValue) { // uppercase value
          model.$viewValue = model.$viewValue.toUpperCase();
          model.$render();
        }
      });
    }
  };
});