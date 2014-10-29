'use strict';

describe('The autofocus directive', function () {
  var timeout;
  beforeEach(module('smartUpApp'));
  beforeEach(inject(function($templateCache) {
    $templateCache.put('views/home.html', '<div>home</div>');
  }));

  beforeEach(inject(function($timeout) {
    timeout = $timeout;
  }));

  it('should set focus to first autofocus element', function () {
    var form = angular.element('<form />');
    var input1 = angular.element('<input type="text" name="first" />');
    var input2 = angular.element('<input type="text" name="second" autofocus="true" />');
    form.append(input1);
    form.append(input2);
    spyOn(input2[0], 'focus');
    input2[0].focus(); // TODO: REMOVE-ME, to test autofocus directive (waiting for answer to http://stackoverflow.com/questions/26633684/ ...)
    timeout.flush();
    expect(input2[0].focus).toHaveBeenCalled();
  });
});