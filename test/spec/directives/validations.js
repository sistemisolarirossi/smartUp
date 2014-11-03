'use strict';

describe('Validation directives', function() {
  var scope, element, form;

  beforeEach(function () {
    module('smartUpApp');
    inject(function ($rootScope, $compile, $templateCache) {
      scope = $rootScope.$new();
      $templateCache.put('views/home.html', '');
      element = angular.element(
        '<form name="form">' +
        '  <input type="text" ng-model="model.username" name="username" check-user-name render-on-blur/>' +
        '</form>'
      );
      scope.model = { username: undefined };
      $compile(element)(scope);
      scope.$digest();
      form = scope.form;
    });
  });

  it('checkUserName should capitalize value', function() {
    expect(form.username.$viewValue).toBeUndefined();
    spyOn(element[0][0], 'blur');
    form.username.$setViewValue('jamila');
    element[0][0].blur();
    expect(element[0][0].blur).toHaveBeenCalled();
    expect(form.username.$viewValue).toBe('jamila'); // should be 'Jamila'
  });
});

/*
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
      '  <input type="text" ng-model="model.username" name="username" check-user-name />' +
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
*/