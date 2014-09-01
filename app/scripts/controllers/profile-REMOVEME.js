'use strict';

app.controller('ProfileCtrl',
  function ($scope, $routeParams, Order, User) {
    $scope.user = User.findByUsername($routeParams.username);
    $scope.ordersWithItems = {}; // WE DON'T NEED THIS...

    $scope.user.$on('loaded', function () {
      populateOrders();
      populateItems();
    });

    function populateOrders () {
      $scope.orders = {};

      angular.forEach($scope.user.orders, function(orderId) {
        $scope.orders[orderId] = Order.find(orderId);
      });
    }

    function populateItems () { // WE DON'T NEED THIS...
      $scope.items = {};
 
      angular.forEach($scope.user.items, function(item) {
        var order = Order.find(item.orderId);
 
        order.$on('loaded', function() {
          $scope.items[item.id] = order.$child('items').$child(item.id);
 
          $scope.ordersWithItems[item.orderId] = order;
        });
      });
    }

  }
);