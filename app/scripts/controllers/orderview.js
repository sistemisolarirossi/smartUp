'use strict';
 
app.controller('OrderViewCtrl', function ($scope, $routeParams, Order) {
  $scope.order = Order.find($routeParams.orderId);
  //console.info('$scope.order:', $scope.order);

  $scope.addItem = function () {
    Order.addItem($routeParams.orderId, $scope.item);
    $scope.item = '';
  };

  $scope.deleteItem = function (item, itemId) {
    Order.deleteItem($scope.order, item, itemId);
  };
});