'use strict';

describe('Validation directives', function() {

  var scope, $compile;
  var validElement = '<input type="text" name="foo" ng-model="foo" value="undef" check-user-name />';

capitalize('abc');

  beforeEach(module('smartUpApp'));
  beforeEach(inject(function($templateCache) {
    $templateCache.put('views/home.html', '<div>home</div>');
  }));
  beforeEach(inject(function(_$rootScope_, _$compile_) {
    scope = _$rootScope_.$new();
    $compile = _$compile_;
  }));

  describe('icon visibility', function() {
    it('should be hidden when text exists in input and focus is lost', function() {
      var element = $compile(validElement)(scope);
var i = element.find('input[name="foo"]');
console.log(i);
i.val('abc');
//console.log(element);
//console.log(element.val('foo1'));
      element.triggerHandler('focus');
      element.triggerHandler('blur');
console.info(i.val());
//console.log(element.isolateScope());
      expect(element.isolateScope().enabled).toBeFalsy();
    });
  });

});

/*
var $scope, compiled;
var template = '<dir></dir>';

describe('Validation directives', function() {
  beforeEach(module('smartUpApp'));
  beforeEach(inject(function($templateCache) {
    $templateCache.put('views/home.html', '<div>home</div>');
  }));
  beforeEach(function() {
    inject(function($compile, $rootScope) {
      $scope = $rootScope.$new();
      compiled = $compile(template)($scope);
      angular.element(compiled).appendTo(document.body);
      $scope.$apply();
    });
  });

  it('Shows weirdness.', function () {
    var i1 = compiled.find('input[name="i1"]')
      //,
      //i2 = compiled.find('input[name="i2"]'),
    ;
    var executed = false;

    angular.element(i1).bind('blur', function () {
        executed = true;
    });

    angular.element(i1).blur();
    expect(executed).toBe(true);
  });

});
*/

/*
var $scope, $form, directiveElement;

describe('Validation directives', function() {
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
    directiveElement.blur();

    $scope.$digest();
    $form = $scope.form;
  }));

  beforeEach(function() {
    expect($form.username.$viewValue).toBeUndefined();
    expect($scope.model.username).toBeUndefined();
  });

  it('Should set username validity', function() {
    $form.username.$setViewValue('jamila');
    expect($form.username.$viewValue).toBe('jamila');

    directiveElement.blur();
    $scope.$digest();

    expect($form.username.$viewValue).toBe('Jamila');

    expect($form.username.$valid).toBe(true);
  });

});
*/

/*
describe('Validation directives', function() {
  var scope, element, windowMock, form, input;
  beforeEach(module('smartUpApp'));
  beforeEach(inject(function($templateCache) {
    $templateCache.put('views/home.html', '<div>home</div>');
  }));
  beforeEach(function () {
    inject(function ($compile, $rootScope, $window) {
      scope = $rootScope;
      input = angular.element('<input ng-model="elem1" name="elem1" check-user-name />');
      element = angular.element('<form name="form"></form>');
      element.append(input);
      
      scope.elem1 = '';
      form = $compile(element)(scope);
      scope.$digest();

      windowMock = $window;
      spyOn(windowMock, 'blur');
    });
  });
  
  it('Should call alert on losing focus', function(){
    var elem1 = input; //form.find('input');
    console.log(elem1.val());
    elem1.val('jamila');
    console.log(elem1.val());
    elem1.triggerHandler('blur');
    console.log(elem1.val());
    console.log(scope.elem1);
    expect(windowMock.blur).toHaveBeenCalled();
    expect(scope.elem1).toEqual('Jamila');
  });
});
*/

/*
var mockdata = [
/ * jshint quotmark: double * /
  "administrator",
  "antonio"
  "demo",
  "marco solari",
/ * jshint quotmark: single * /
];
*/

/*
describe('Validation directives', function() {
  var $scope, form, compiled;
  beforeEach(module('smartUpApp'));
  beforeEach(inject(function($templateCache) {
    $templateCache.put('views/home.html', '<div>home</div>');
  }));

  beforeEach(inject(function($compile, $rootScope) {
    $scope = $rootScope;
    var element = angular.element(
      '<form name="form">' +
        '<input ng-model="model.elem1" name="elem1" check-user-name />' +
      '</form>'
    );
    $scope.model = { elem1: null };
    compiled = $compile(element)($scope);
    $scope.$digest();
    form = $scope.form;
  }));

  it('should validate valid user name', function() {
    var val = 'jamila_';
    expect($scope.model.elem1).toBe(null);
    form.elem1.$setViewValue(val);

    spyOn($scope, '$apply');
    compiled.triggerHandler('blur');

    //expect($scope.$apply).toHaveBeenCalled();

    $scope.$digest();

    //console.log(form.elem1);

    expect($scope.model.elem1).toEqual(val);
    expect(form.elem1.$valid).toBe(true);
  });
  it('should validate invalid user name', function() {
    var val = '_marco';
    expect($scope.model.elem1).toBe(null);
    form.elem1.$setViewValue(val);
    expect($scope.model.elem1).toBeUndefined();
    expect(form.elem1.$valid).toBe(false);
  });
});
*/