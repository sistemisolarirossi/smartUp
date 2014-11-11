'use strict';

describe('The autofocus directive', function () {
  var element, scope, timeout;
  beforeEach(function () {
    module('smartUpApp');
    inject(function ($rootScope, $compile, $timeout, $templateCache, $httpBackend) {
      scope = $rootScope.$new();
      timeout = $timeout;
      $templateCache.put('views/home.html', '');
      $httpBackend.expectGET('i18n/it.json').respond();
      element = angular.element(
        '<form>' +
        '  <input type="text" name="0" />' +
        '  <input type="text" name="1" autofocus="true" />' +
        '</form>'
      );
      $compile(element)(scope);
      scope.$digest();
    });
  });

  it('should set focus to first autofocus element', function () {
    var input = element.find('input');
    spyOn(input[1], 'focus');
    timeout.flush();
    expect(input[1].focus).toHaveBeenCalled();
  });
  it('should not set focus to first element (without autofocus)', function () {
    var input = element.find('input');
    spyOn(input[0], 'focus');
    timeout.flush();
    expect(input[0].focus).not.toHaveBeenCalled();
  });
});