'use strict';

describe('Validation directives checkUserName', function() {
  var scope, element, form;

  beforeEach(function () {
    module('smartUpApp');
    inject(function ($rootScope, $compile, $templateCache, $httpBackend) {
      $templateCache.put('views/home.html', '');
      $httpBackend.expectGET('i18n/it.json').respond();
      scope = $rootScope.$new();
      element = angular.element(
        '<form name="form">' +
        '  <input type="text" ng-model="model.username" name="username" check-user-name />' +
        '</form>'
      );
      scope.model = { username: undefined };
      $compile(element)(scope);
      scope.$digest();
      form = scope.form;
      //spyOn(element[0][0], 'blur');
    });
  });

/*
  it('should capitalize value', function() { // TODO: blur() doesn't works
    expect(form.username.$viewValue).toBeUndefined();
    form.username.$setViewValue('jamila');
    element[0][0].blur();
    scope.$digest();
    expect(element[0][0].blur).toHaveBeenCalled();
    expect(form.username.$viewValue).toBe('jamila'); // should be 'Jamila'
    expect(scope.model.username).toBe('jamila'); // should be 'Jamila'
  });
*/

  it('should pass with "marco"', function() {
    form.username.$setViewValue('marco');
    scope.$digest();
    expect(form.username.$valid).toBe(true);
  });

  it('should not pass with "_marco"', function() {
    form.username.$setViewValue('_marco');
    scope.$digest();
    expect(form.username.$valid).toBe(false);
  });

  it('should not pass with "m.arco"', function() {
    form.username.$setViewValue('m.arco');
    scope.$digest();
    expect(form.username.$valid).toBe(false);
  });

  it('should not pass with empty value', function() {
    form.username.$setViewValue(null);
    scope.$digest();
    expect(form.username.$valid).toBe(false);
  });
});

describe('Validation directive checkDuration', function() {
  var scope, element, form;

  beforeEach(function () {
    module('smartUpApp');
    inject(function ($rootScope, $compile, $templateCache, $httpBackend) {
      $templateCache.put('views/home.html', '');
      $httpBackend.expectGET('i18n/it.json').respond();
      scope = $rootScope.$new();
      element = angular.element(
        '<form name="form">' +
        '  <input type="text" ng-model="model.duration" name="duration" check-duration>' +
        '</form>'
      );
      scope.model = { duration: undefined };
      $compile(element)(scope);
      scope.$digest();
      form = scope.form;
    });
  });

  it('checkUserName should pass with "1"', function() {
    form.duration.$setViewValue('1');
    scope.$digest();
    expect(form.duration.$valid).toBe(true);
  });

  it('checkUserName should pass with "2:30"', function() {
    form.duration.$setViewValue('2:30');
    scope.$digest();
    expect(form.duration.$valid).toBe(true);
  });

  it('checkUserName should pass with "2.30"', function() {
    form.duration.$setViewValue('2.30');
    scope.$digest();
    expect(form.duration.$valid).toBe(true);
  });

  it('checkUserName should not pass with "2,30"', function() {
    form.duration.$setViewValue('2,30');
    scope.$digest();
    expect(form.duration.$valid).toBe(false);
  });
  
  it('checkUserName should not pass with "2.60"', function() {
    form.duration.$setViewValue('2.60');
    scope.$digest();
    expect(form.duration.$valid).toBe(false);
  });

  it('checkUserName should not pass with "-1"', function() {
    form.duration.$setViewValue('-1');
    scope.$digest();
    expect(form.duration.$valid).toBe(false);
  });

  it('checkUserName should not pass with "abc"', function() {
    form.duration.$setViewValue('abc');
    scope.$digest();
    expect(form.duration.$valid).toBe(false);
  });
});

describe('Validation directive checkCustomerName', function() {
  var scope, element, form;

  beforeEach(function () {
    module('smartUpApp');
    inject(function ($rootScope, $compile, $templateCache, $httpBackend) {
      $templateCache.put('views/home.html', '');
      $httpBackend.expectGET('i18n/it.json').respond();
      scope = $rootScope.$new();
      element = angular.element(
        '<form name="form">' +
        '  <input type="text" ng-model="model.customername" name="customername" check-customer-name />' +
        '</form>'
      );
      scope.model = { customername: undefined };
      $compile(element)(scope);
      scope.$digest();
      form = scope.form;
    });
  });

  it('should pass with "marco"', function() {
    form.customername.$setViewValue('marco');
    scope.$digest();
    expect(form.customername.$valid).toBe(true);
  });

  it('should pass with "ACME & C."', function() {
    form.customername.$setViewValue('marco');
    scope.$digest();
    expect(form.customername.$valid).toBe(true);
  });

  it('should pass with unicode characters', function() {
    form.customername.$setViewValue('koinè');
    scope.$digest();
    expect(form.customername.$valid).toBe(true);
  });

  it('should not pass with empty value', function() {
    form.customername.$setViewValue('');
    scope.$digest();
    expect(form.customername.$valid).toBe(false);
  });
});

describe('Validation directive checkEmail', function() {
  var scope, element, form;

  beforeEach(function () {
    module('smartUpApp');
    inject(function ($rootScope, $compile, $templateCache, $httpBackend) {
      $templateCache.put('views/home.html', '');
      $httpBackend.expectGET('i18n/it.json').respond();
      scope = $rootScope.$new();
      element = angular.element(
        '<form name="form">' +
        '  <input type="text" ng-model="model.email" name="email" check-email />' +
        '</form>'
      );
      scope.model = { email: undefined };
      $compile(element)(scope);
      scope.$digest();
      form = scope.form;
    });
  });

  it('should pass with "example@mail.com"', function() {
    form.email.$setViewValue('example@mail.com');
    scope.$digest();
    expect(form.email.$valid).toBe(true);
  });

  it('should pass with "Abc.123@example.com"', function() {
    form.email.$setViewValue('Abc.123@example.com');
    scope.$digest();
    expect(form.email.$valid).toBe(true);
  });

  it('should not pass with "noatsignexample.com"', function() {
    form.email.$setViewValue('noatsignexample.com');
    scope.$digest();
    expect(form.email.$valid).toBe(false);
  });

  it('should not pass with "あいうえお@example.com"', function() {
    form.email.$setViewValue('あいうえお@example.com');
    scope.$digest();
    expect(form.email.$valid).toBe(false);
  });
});

describe('Validation directive checkPassword', function() {
  var scope, element, form;

  beforeEach(function () {
    module('smartUpApp');
    inject(function ($rootScope, $compile, $templateCache, $httpBackend) {
      $templateCache.put('views/home.html', '');
      $httpBackend.expectGET('i18n/it.json').respond();
      scope = $rootScope.$new();
      element = angular.element(
        '<form name="form">' +
        '  <input type="text" ng-model="model.password" name="password" check-password />' +
        '</form>'
      );
      scope.model = { password: undefined };
      $compile(element)(scope);
      scope.$digest();
      form = scope.form;
    });
  });

  it('should pass with "password"', function() {
    form.password.$setViewValue('password');
    scope.$digest();
    expect(form.password.$valid).toBe(true);
  });

  it('should not pass with "passwor"', function() {
    form.password.$setViewValue('passwor');
    scope.$digest();
    expect(form.password.$valid).toBe(false);
  });

  it('should pass with unicode characters', function() {
    form.password.$setViewValue('è questa la password');
    scope.$digest();
    expect(form.password.$valid).toBe(true);
  });

  it('should not pass with empty value', function() {
    form.password.$setViewValue('');
    scope.$digest();
    expect(form.password.$valid).toBe(false);
  });
});

describe('Validation directive checkPhone', function() {
  var scope, element, form;

  beforeEach(function () {
    module('smartUpApp');
    inject(function ($rootScope, $compile, $templateCache, $httpBackend) {
      $templateCache.put('views/home.html', '');
      $httpBackend.expectGET('i18n/it.json').respond();
      scope = $rootScope.$new();
      element = angular.element(
        '<form name="form">' +
        '  <input type="text" ng-model="model.phone" name="phone" check-phone />' +
        '</form>'
      );
      scope.model = { phone: undefined };
      $compile(element)(scope);
      scope.$digest();
      form = scope.form;
    });
  });

  it('should pass with "123456', function() {
    form.phone.$setViewValue('123456');
    scope.$digest();
    expect(form.phone.$valid).toBe(true);
  });
  it('should pass with "01112345678"', function() {
    form.phone.$setViewValue('01112345678');
    scope.$digest();
    expect(form.phone.$valid).toBe(true);
  });

  it('should pass with "02 12345678"', function() {
    form.phone.$setViewValue('02 12345678');
    scope.$digest();
    expect(form.phone.$valid).toBe(true);
  });

  it('should pass with "+39 02 12345678"', function() {
    form.phone.$setViewValue('+39 02 12345678');
    scope.$digest();
    expect(form.phone.$valid).toBe(true);
  });

  it('should pass with "0039 0187 12345678"', function() {
    form.phone.$setViewValue('0039 0187 12345678');
    scope.$digest();
    expect(form.phone.$valid).toBe(true);
  });

  it('should pass with "(0039) 06 12345678"', function() {
    form.phone.$setViewValue('(0039) 06 12345678');
    scope.$digest();
    expect(form.phone.$valid).toBe(true);
  });

  it('should not pass with "12345', function() {
    form.phone.$setViewValue('12345');
    scope.$digest();
    expect(form.phone.$valid).toBe(false);
  });

  it('should not pass with "12345678x', function() {
    form.phone.$setViewValue('12345678x');
    scope.$digest();
    expect(form.phone.$valid).toBe(false);
  });
});

describe('Validation directive checkCfOrPiva', function() {
  var scope, element, form;

  beforeEach(function () {
    module('smartUpApp');
    inject(function ($rootScope, $compile, $templateCache, $httpBackend) {
      $templateCache.put('views/home.html', '');
      $httpBackend.expectGET('i18n/it.json').respond();
      scope = $rootScope.$new();
      element = angular.element(
        '<form name="form">' +
        '  <input type="text" ng-model="model.cforpiva" name="cforpiva" check-cf-or-piva />' +
        '</form>'
      );
      scope.model = { cforpiva: undefined };
      $compile(element)(scope);
      scope.$digest();
      form = scope.form;
    });
  });

  it('should pass with "00000000000', function() {
    form.cforpiva.$setViewValue('00000000000');
    scope.$digest();
    expect(form.cforpiva.$valid).toBe(true);
  });

  it('should not pass with "00000000001', function() {
    form.cforpiva.$setViewValue('00000000001');
    scope.$digest();
    expect(form.cforpiva.$valid).toBe(false);
  });

  it('should not pass with "xyz', function() {
    form.cforpiva.$setViewValue('xyz');
    scope.$digest();
    expect(form.cforpiva.$valid).toBe(false);
  });

  it('should pass with "SLRMRC61M31L219Y', function() {
    form.cforpiva.$setViewValue('SLRMRC61M31L219Y');
    scope.$digest();
    expect(form.cforpiva.$valid).toBe(true);
  });

  it('should not pass with "SLRMRC61M31L219Z', function() {
    form.cforpiva.$setViewValue('SLRMRC61M31L219Z');
    scope.$digest();
    expect(form.cforpiva.$valid).toBe(false);
  });

});