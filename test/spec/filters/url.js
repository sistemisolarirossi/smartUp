'use strict';

describe('The url filter', function () {

  var $filter;

  beforeEach(function () {
    module('smartUpApp');

    inject(function (_$filter_) {
      $filter = _$filter_;
    });
  });

  beforeEach(angular.mock.inject(function($templateCache) {
    $templateCache.put('views/home.html', '<div>home</div>');
  }));

  it('hostnameFromUrl should return hostname from url (http)', function () {
    expect($filter('hostnameFromUrl')
      ('http://www.example.com/blah/blah.html'))
      .toEqual('www.example.com');
  });
  it('hostnameFromUrl should return hostname from url (http, capitalized)', function () {
    expect($filter('hostnameFromUrl')
      ('http://www.Example.com/blah/blah.html'))
      .toEqual('www.example.com');
  });
  it('hostnameFromUrl should return hostname from url ()', function () {
    expect($filter('hostnameFromUrl')
      ('http://www.example.com:12345/blah/blah.html'))
      .toEqual('www.example.com');
  });
  it('hostnameFromUrl should return hostname from url ()', function () {
    expect($filter('hostnameFromUrl')
      ('anyschema://www.example.com/'))
      .toEqual('www.example.com');
  });
  it('hostnameFromUrl should return hostname from url ()', function () {
    expect($filter('hostnameFromUrl')
      ('http://10.1.2.3:45678/xyz'))
      .toEqual('10.1.2.3');
  });
  it('hostnameFromUrl should return hostname from url ()', function () {
    expect($filter('hostnameFromUrl')
      ('wrongurl'))
      .toEqual('localhost');
  });
  it('hostnameFromUrl should return hostname from url ()', function () {
    expect($filter('hostnameFromUrl')
      (null))
      .toEqual('');
  });
});
