'use strict';
 
app.factory('User', function ($firebase, CFG) {
  var refUsers = new Firebase(CFG.FIREBASE_URL + 'users');
  var syncUsers = $firebase(refUsers);
  var users = syncUsers.$asObject();
console.log('--- users:', users);

  var User = {
    all: users,
    find: function (uid) {
      return users[uid];
    },
/*
    signedIn: function () {
      return $rootScope.currentUser !== undefined;
    },
    setCurrentUser: function (user) {
      $rootScope.currentUser = user; //User.findByUsername(username);
    },
    resetCurrentUser: function () {
      delete $rootScope.currentUser;
    }
*/
  };

  return User;

});