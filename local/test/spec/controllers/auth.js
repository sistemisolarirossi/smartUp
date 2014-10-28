/*
'use strict';

describe('Controller: AuthCtrl', function () {

  // load the controller's module
  beforeEach(module('smartUpApp'));

  var ctrl, scope;
  // inject the $controller and $rootScope services in the beforeEach block
  beforeEach(inject(function($controller, $rootScope) {
    // create a new scope that's a child of the $rootScope
    scope = $rootScope.$new();
    // create the controller
    ctrl = $controller('AuthController', {
      $scope: scope
    });
  }));

//  it('should set $scope.selectedLanguage when calling init', 
//    function() {
//    	console.info(scope);
//      expect(scope.selectedLanguage).toBeUndefined();
//      scope.init();
//      expect(scope.selectedLanguage).toEqual('it');
//    }
//  );

  it('one is one', function () {
    expect(1).toBe(1);
  });

});
*/