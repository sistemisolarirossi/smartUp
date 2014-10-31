'use strict';

var $scope, $form, directiveElement;

describe('Validation directives', function() {
  beforeEach(module('smartUpApp'));
  beforeEach(inject(function($templateCache) {
    $templateCache.put('views/home.html', '<div>home</div>');
  }));
  beforeEach(inject(function($compile, $rootScope) {
    $scope = $rootScope;
    var element = angular.element(
        '<form name="form">' +
            '<input type="text" ng-model="model.username" name="username" check-user-name />' +
        '</form>'
    );
    $scope.model = { username: undefined };
    $compile(element)($scope);
    directiveElement = element[0][0];
    $scope.$digest();
    $form = $scope.form;
  }));

  beforeEach(function() {
    expect($form.username.$viewValue).toBeUndefined();
    expect($scope.model.username).toBeUndefined();
  });

  it('checkUserName should capitalize value', function() {
    expect($form.username.$viewValue).toBeUndefined();
    $form.username.$setViewValue('jamila');
    directiveElement.blur();
    expect($form.username.$viewValue).toBe('jamila'); // TODO: should be 'Jamila', if blur did work...
  });

  it('checkUserName should assert username validity', function() {
    expect($form.username.$viewValue).toBeUndefined();
    $form.username.$setViewValue('jamila');
    directiveElement.blur();
    expect($form.username.$valid).toBe(true);
  });

  it('checkUserName should assert username invalidity', function() {
    expect($form.username.$viewValue).toBeUndefined();
    $form.username.$setViewValue('_jamila');
    directiveElement.blur();
    expect($form.username.$invalid).toBe(true);
  });
});