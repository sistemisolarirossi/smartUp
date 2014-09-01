'use strict';
 
app.controller('OrdersCtrl', function ($scope, $location, Order) {

  if ($location.path() === '/orders') { // avoid overriding $scope.orders when listing specific user's orders
    $scope.orders = Order.all;
  }
  var now = new Date();

  $scope.orderPlaceholder = { url: 'http://', title: '' };
  $scope.orderPlaceholder = { customer: '', title: '', date: now, delivery: '', };
  $scope.order = $scope.orderPlaceholder;

  $scope.submitOrder = function () {
    //console.log('submitOrder in OrdersCtrl');
    Order.create($scope.order).then(function (orderId) { /*ref*/
      $scope.order = $scope.orderPlaceholder;
      $location.path('/orders/' + /*ref.name()*/orderId);
    });
  };

  $scope.deleteOrder = function (orderId) {
    Order.delete(orderId);
  };

});