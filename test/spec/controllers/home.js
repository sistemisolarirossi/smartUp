'use strict';

describe('HomeCtrl', function () {
  var scope;
  var $location;
 
  // mock application to allow us to inject our own dependencies
  beforeEach(angular.mock.module('smartUpApp'));
  
  // mock the controller for the same reason and include $rootScope and $controller
  beforeEach(angular.mock.inject(function($rootScope, $controller, _$location_, $templateCache) {

    $location = _$location_;

    $templateCache.put('i18n/it.json', {'it':{'original text':'italian text'}});

    $templateCache.put('views/about.html', '<div>about</div>');
    $templateCache.put('views/contacts.html', '<div>contacts</div>');
    $templateCache.put('views/customers.html', '<div>customers</div>');
    $templateCache.put('views/home.html', '<div>home</div>');
    $templateCache.put('views/login.html', '<div>login/div>');
    $templateCache.put('views/orders.html', '<div>orders</div>');
    $templateCache.put('views/register.html', '<div>register</div>');
    $templateCache.put('views/serviceReports.html', '<div>service reports</div>');
    $templateCache.put('views/users.html', '<div>users</div>');

    // create an empty scope
    scope = $rootScope.$new();

    // declare the controller and inject our empty scope
    $controller('HomeCtrl', { $scope: scope });
  }));

  // tests start here
  it('should have a method to check if the path is active', function() {
    expect(scope.isActive('/fake')).toBe(false);

    $location.path('/home');
    expect($location.path()).toBe('/home');
    expect(scope.isActive('/home')).toBe(true);
    expect(scope.isActive('/')).toBe(false);

    $location.path('/about');
    expect($location.path()).toBe('/about');
    expect(scope.isActive('/about')).toBe(true);
    expect(scope.isActive('/')).toBe(false);

  });
});