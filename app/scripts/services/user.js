'use strict';
 
app.factory('User', function ($rootScope, $firebase, CFG) {
  var ref = new Firebase(CFG.FIREBASE_URL + 'users');
  var users = $firebase(ref);
 
  var User = {
    create: function (authUser, username) {
console.info('authUser:', authUser);
      /* jshint camelcase: false */
      users[username] = {
        md5_hash: authUser.md5_hash, // we need this for gravatars
        username: username,
        $priority: authUser.uid
      };

      users.$save(username).then(function () {
        setCurrentUser(username);
      });
    },
    findByUsername: function (username) {
      if (username) {
        return users.$child(username);
      }
    },
    getCurrent: function () {
      return $rootScope.currentUser;
    },
    signedIn: function () {
      //console.info('$rootScope.currentUser:', $rootScope.currentUser);
      return $rootScope.currentUser !== undefined;
    }
  };

  function setCurrentUser (username) {
    $rootScope.currentUser = User.findByUsername(username);
    //console.log('setCurrentUser('+username+') - $rootScope.currentUser:', $rootScope.currentUser);
  }

  function resetCurrentUser () {
    delete $rootScope.currentUser;
  }

  $rootScope.$on('$firebaseSimpleLogin:login', function (e, authUser) {
    var query = $firebase(ref.startAt(authUser.uid).endAt(authUser.uid));
     
    query.$on('loaded', function () {
      //console.info('query.$on("loaded" ...:', authUser.uid);
      console.info('query.$on("loaded" ...:', query.$getIndex()[0]);
      setCurrentUser(query.$getIndex()[0]);
    });
  });

  $rootScope.$on('$firebaseSimpleLogin:logout', function() {
    //console.info('Logout fired...');
    resetCurrentUser();
  });

  return User;
});