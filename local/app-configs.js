app.config(function (ngQuickDateDefaultsProvider) {
  return ngQuickDateDefaultsProvider.set({
    closeButtonHtml: '<i class="glyphicon glyphicon-remove-circle"></i>',
    buttonIconHtml: '<i class="glyphicon glyphicon-time"></i>&nbsp;',
    nextLinkHtml: '<i class="glyphicon glyphicon-chevron-right"></i>',
    prevLinkHtml: '<i class="glyphicon glyphicon-chevron-left"></i>'
  });
});

app.config(function ($httpProvider) {
  $httpProvider.responseInterceptors.push('myHttpInterceptor');
  var spinnerFunction = function (data, headersGetter) {
    // todo start the spinner here
    $('#loading').show();
    return data;
  };
  $httpProvider.defaults.transformRequest.push(spinnerFunction);
});

// register the interceptor as a service, intercepts ALL angular ajax http calls
app.factory('myHttpInterceptor', function ($q, $window) {
  return function (promise) {
    return promise.then(function (response) {
      // hide the spinner on success
      $('#loading').hide();
      return response;
    }, function (response) {
      // hide the spinner on error
      $('#loading').hide();
      return $q.reject(response);
    });
  };
});