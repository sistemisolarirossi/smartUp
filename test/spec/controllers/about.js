'use strict';

//describe('Controller: AboutCtrl', function () {
describe('AboutCtrl', function () {

  //// load the controller's module
  //beforeEach(module('smartUpApp'));

  var scope; // we'll use this scope in our tests
 
  // mock application to allow us to inject our own dependencies
  beforeEach(angular.mock.module('smartUpApp'));
  
  // mock the controller for the same reason and include $rootScope and $controller
  beforeEach(angular.mock.inject(function($rootScope, $controller, $templateCache) {

    $templateCache.put('views/home.html', '<div>home</div>');
    $templateCache.put('i18n/it.json', {'it':{'original text':'italian text'}});

    // create an empty scope
    scope = $rootScope.$new();
    // declare the controller and inject our empty scope
    $controller('AboutCtrl', { $scope: scope });
  }));
  
  // tests start here
  it('one is one', function () {
    expect(1).toBe(1);
  });

  
});