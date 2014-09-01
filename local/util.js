'use strict';

app.factory('Util', function () {

  var Util = {

   /**
      * Check Phone Number
      *
      * Input: value to be checked
      * Output: null if value is valid, error message string otherwise
      */
    checkPhoneNumber: function (value) {
      if (!value) {
        return 'Phone number is wrong: it can\'t be empty';
      }
      var phonePattern = /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/;
      var re = new RegExp(phonePattern, 'g');
      if (value.match(re) === null) {
        return 'Phone number doesn\'t apper to be valid';
      }
      return null;
    },

    /**
      * Check Codice Fiscale
      *
      * Input: value to be checked
      * Output: null if value is valid, error message string otherwise
      */
    checkCodiceFiscale: function (value) {
      if (!value) {
        return 'Codice fiscale is wrong: it can\'t be empty';
      }
      value = value.toUpperCase();
      if (value.length !== 16) {
        return 'Codice fiscale is wrong: it\'s length should be exactly 16 characters';
      }
      var valid = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      var i;
      for (i = 0; i < 16; i++) {
        if (valid.indexOf(value.charAt(i)) === -1) {
          return 'Codice fiscale is wrong: it contains invalid character \'' + value.charAt(i) + '\'; valid characters are only letters and digits';
        }
      }
      var set1 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var set2 = 'ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var seteven = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var setodd = 'BAKPLCQDREVOSFTGUHMINJWZYX';
      var s = 0;
      for (i = 1; i <= 13; i += 2) {
        s += seteven.indexOf(set2.charAt(set1.indexOf(value.charAt(i))));
      }
      for (i = 0; i <= 14; i += 2) {
        s += setodd.indexOf(set2.charAt(set1.indexOf(value.charAt(i))));
      }
      if (s % 26 !== value.charCodeAt(15) - 'A'.charCodeAt(0)) {
        return 'Codice fiscale is wrong: check code doesn\'t match';
      }
      return null; // success
    },

    /**
      * Check Partita IVA
      *
      * Input: value to be checked
      * Output: null if value is valid, error message string otherwise
      */
    checkPartitaIVA: function (value) {
      if (!value) {
        return 'Partita IVA is wrong: it can\'t be empty';
      }
      if (value.length !== 11) {
        return 'Partita IVA is wrong: it\'s length should be exactly 11 characters';
      }
      var valid = '0123456789';
      var i;
      for (i = 0; i < 11; i++) {
        if (valid.indexOf(value.charAt(i)) === -1) {
          return 'Partita IVA is wrong: it contains invalid character \'' + value.charAt(i) + '\'; valid characters are only digits';
        }
      }
      var s = 0;
      for (i = 0; i <= 9; i += 2) {
        s += value.charCodeAt(i) - '0'.charCodeAt(0);
      }
      for (i = 1; i <= 9; i += 2) {
        var c = 2 * (value.charCodeAt(i) - '0'.charCodeAt(0));
        if (c > 9) {
          c = c - 9;
        }
        s += c;
      }
      if ((10 - s % 10) % 10 !== value.charCodeAt(10) - '0'.charCodeAt(0)) {
        return 'Partita IVA is wrong: check code doesn\'t match';
      }

      return null; // success
    }

  };
  
  return Util;

});