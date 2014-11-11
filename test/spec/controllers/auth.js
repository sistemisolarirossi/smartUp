'use strict';

describe('AuthCtrl', function () {
  var scope;
 
  // mock application to allow us to inject our own dependencies
  beforeEach(angular.mock.module('smartUpApp'));
  
  // mock the controller for the same reason and include $rootScope and $controller
  beforeEach(angular.mock.inject(function($rootScope, $controller, $templateCache, $httpBackend) {
    $templateCache.put('views/home.html', '');
    $httpBackend.expectGET('i18n/it.json').respond();

    // create an empty scope
    scope = $rootScope.$new();

    // declare the controller and inject our empty scope
    $controller('AuthCtrl', { $scope: scope });
  }));

/*
  // tests start here
  it('should have a method to initialize controller', function() {
    
    expect(scope).toBeDefined();
    expect(scope.init());
    expect(scope.selectedLanguage.length()).toBe(2);

  });
*/
});