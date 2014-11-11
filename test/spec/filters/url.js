'use strict';

describe('The url filter', function () {

  var $filter;

  beforeEach(function () {
    module('smartUpApp');

    inject(function (_$filter_) {
      $filter = _$filter_;
    });
  });

  beforeEach(angular.mock.inject(function($templateCache, $httpBackend) {
    $templateCache.put('views/home.html', '');
    $httpBackend.expectGET('i18n/it.json').respond();
  }));

  describe('hostnameFromUrl', function () {
    it('should return hostname from url (http)', function () {
      expect($filter('hostnameFromUrl')
        ('http://www.example.com/blah/blah.html'))
        .toEqual('www.example.com');
    });
    it('should return hostname from url (http, capitalized)', function () {
      expect($filter('hostnameFromUrl')
        ('http://www.Example.com/blah/blah.html'))
        .toEqual('www.example.com');
    });
    it('should return hostname from url (:port/dir/file)', function () {
      expect($filter('hostnameFromUrl')
        ('http://www.example.com:12345/blah/blah.html'))
        .toEqual('www.example.com');
    });
    it('should return hostname from url (wrong schema)', function () { // NOTE: this fails with FF
      expect($filter('hostnameFromUrl')
        ('wrong://www.example.com/'))
        .toEqual('www.example.com');
    });
    it('should return hostname from url (numeric host with port and dir)', function () {
      expect($filter('hostnameFromUrl')
        ('http://10.1.2.3:45678/xyz'))
        .toEqual('10.1.2.3');
    });
    it('should return hostname from url (wrong url)', function () { // NOTE: this fails with FF
      expect($filter('hostnameFromUrl')
        ('wrongurl'))
        .toEqual('localhost');
    });
    it('should return hostname from url (null)', function () { // NOTE: this fails with FF
      expect($filter('hostnameFromUrl')
        (null))
        .toEqual('');
    });
  });
});
