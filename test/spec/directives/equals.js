'use strict';

describe('Equals directive', function() {
  var $scope, form;
  beforeEach(module('smartUpApp'));
  beforeEach(inject(function($templateCache, $httpBackend, $compile, $rootScope) {
    $templateCache.put('views/home.html', '<div>home</div>');
    $httpBackend.expectGET('i18n/it.json').respond();
    $scope = $rootScope;
    var element = angular.element(
      '<form name="form">' +
        '<input ng-model="model.elem1" name="elem1" />' +
        '<input ng-model="model.elem2" name="elem2" equals="abc" />' +
      '</form>'
    );
    $scope.model = { elem1: null, elem2: null };
    $compile(element)($scope);
    $scope.$digest();
    form = $scope.form;
  }));

  it('should validate equal values', function() {
    var val = 'abc';
    form.elem1.$setViewValue(val);
    form.elem2.$setViewValue(val);
    expect($scope.model.elem1).toEqual(val);
    expect($scope.model.elem2).toEqual(val);
    expect(form.elem2.$valid).toBe(true);
  });
  it('should not validate different values', function() {
    var val1 = 'abc';
    var val2 = 'xyz';
    form.elem1.$setViewValue(val1);
    form.elem1.$setViewValue(val2);
    expect($scope.model.elem2).toBe(null);
    expect(form.elem2.$valid).toBe(false);
  });

});