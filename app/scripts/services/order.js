'use strict';
     
app.factory('Order', function ($firebase, FIREBASE_URL, User) {
  //return $resource(FIREBASE_URL + 'orders/:id.json');
  var ref = new Firebase(FIREBASE_URL + 'orders');
  var orders = $firebase(ref);
  //console.info('ref:', ref);
  //console.info('orders:', orders);

  var Order = {
    all: orders,
    create: function (order) {
      if (User.signedIn()) {
        var user = User.getCurrent();

        order.owner = user.username;
        
        return orders.$add(order).then(function (ref) {
          var orderId = ref.name(); 
          user.$child('orders').$child(orderId).$set(orderId);
          return orderId;
        });
      }
    },
    find: function (orderId) {
      return orders.$child(orderId);
    },
    delete: function (orderId) {
      //return orders.$remove(orderId);
      if (User.signedIn()) {
        var order = Order.find(orderId);
 
        order.$on('loaded', function () {
          var user = User.findByUsername(order.owner);
 
          orders.$remove(orderId).then(function () {
            user.$child('orders').$remove(orderId);
          });
        });
      }
    },
    addItem: function (orderId, item) {
      if (User.signedIn()) {
        var user = User.getCurrent();
 
        item.username = user.username;
        item.orderId = orderId;
 
        orders.$child(orderId).$child('items').$add(item).then(
          function (ref) { // add a reference to this order item on current user
            user.$child('items').$child(ref.name()).$set({id: ref.name(), orderId: orderId});
          }
        );
      }
    },
    deleteItem: function (order, item, itemId) {
      if (User.signedIn()) {
        var user = User.findByUsername(item.username);
 
        order.$child('items').$remove(itemId).then(function () {
          user.$child('items').$remove(itemId);
        });
      }
    }
    
  };
 
  return Order;
});