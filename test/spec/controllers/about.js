'use strict';

describe('Controller: AboutCtrl', function () {

  // load the controller's module
  beforeEach(module('smartUpApp'));

  var ctrl, scope;
  // inject the $controller and $rootScope services in the beforeEach block
  beforeEach(inject(function($controller, $rootScope) {
    // create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    // create the controller
    ctrl = $controller('AboutController', {
      $scope: scope
    });
  }));

  it('one is one', function () {
    expect(1).toBe(1);
  });

  it('formLabel is set', function () {
    //expect(rootScope.formLabel).toBeUndefined();
    expect(rootScope.formLabel).toBe('About');
  });
});