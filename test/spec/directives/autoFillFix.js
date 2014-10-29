'use strict';

describe('The autoFillFix directive', function () {
  var $scope, form;
  beforeEach(module('smartUpApp'));
  beforeEach(inject(function($templateCache) {
    $templateCache.put('views/home.html', '<div>home</div>');
  }));
  beforeEach(inject(function($compile, $rootScope) {
    $scope = $rootScope;
    var element = angular.element(
      '<form name="formLogin">' +
      '<input type="text" name="usernameOrEmail" ng-model="user.usernameOrEmail" autocomplete="on" autofocus="true" autofill-fix check-not-empty tabindex="1" />' +
      '</form>'
    );
    $scope.model = {};
    $scope.model.user = { usernameOrEmail: 'to-be-filled value' };
    $compile(element)($scope);
    $scope.$digest();
    form = $scope.formLogin;
  }));

  describe('autofillfix', function() {
    it('should apply new value to model, after scope digest', function() {
      form.usernameOrEmail.$setViewValue('new value');
      expect($scope.user.usernameOrEmail).toEqual('new value');
      expect(form.usernameOrEmail.$valid).toBe(true);
    });
    // TODO: test for *auto fill fix*, i.e. if browser's autocompleted value is applyed to model
  });
});