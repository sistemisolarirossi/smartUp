'use strict';

//app.directive('reallyClick', ['$modal', function($modal) {    
app.directive('reallyClick', function($modal) {    
  return {
    restrict: 'A',
    scope: {
      reallyClick: '&',
      item: '='
    },
    link: function (scope, element, attrs) {
      element.bind( 'click', function() {
        var message = attrs.reallyMessage || 'Are you sure?';
        var modalHtml = '<div class="modal-body">' + message + '</div>';
        modalHtml += '<div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>';

        var modalInstance = $modal.open({
          template: modalHtml,
          controller: 'ModalInstanceCtrl'
        });

        modalInstance.result.then(function () {
          scope.reallyClick({item:scope.item}); // raise an error: $digest already in progress
        }, function() {
          // modal dismissed
        });
      });
    }
  };
});