'use strict';
 
app.factory('User', function ($rootScope, $firebase, CFG) {
  var refUsers = new Firebase(CFG.FIREBASE_URL + 'users');
  var users = $firebase(refUsers);
  var refUsersByName = new Firebase(CFG.FIREBASE_URL + 'usersByName');
  var usersByName = $firebase(refUsersByName);

  var User = {
    create: function (user) {
      console.info('***** user:', user);
      /* jshint camelcase: false */
      users[user.uid] = {
        imageUrl: user.imageUrl, // image url
        md5Hash: user.md5_hash, // email MD5 hash (we need this for gravatars) (TODO: use imgeUrl...)
        email: user.email, // TODO: check if this poses a security issue (it should not...)
        username: user.username, // TODO: do we really really need this field?
        provider: user.provider, // auth provider
        id: user.id, // user id
        uid: user.uid,// user uid (unique id among auth providers)
        isTemporaryPassword: user.isTemporaryPassword, // is password temporary?
        firebaseAuthToken: user.firebaseAuthToken, // TODO: how to use this value?
        roles: {} // TODO: handle default roles...
      };
console.info('users[user.uid]:', users[user.uid]);
console.info('---- User.setCurrentUser BEFORE', $rootScope.currentUser);
User.setCurrentUser(user);
console.info('---- User.setCurrentUser AFTER', $rootScope.currentUser);
      usersByName.$child(user.username.toLowerCase()).$set(user.uid);
      return users.$save(user.uid);
    },
    findByUsername: function (username) {
      if (username) {
        return usersByName[username.toLowerCase()];
      } else {
        return null;
      }
    },
    getCurrent: function () {
      return $rootScope.currentUser;
    },
    signedIn: function () {
      //console.info('$rootScope.currentUser:', $rootScope.currentUser);
      return $rootScope.currentUser !== undefined;
    },
    setCurrentUser: function (user) {
      $rootScope.currentUser = user; //User.findByUsername(username);
      console.log('method setCurrentUser('+user.uid+') - $rootScope.currentUser:', $rootScope.currentUser.uid);
    },
    resetCurrentUser: function () {
      delete $rootScope.currentUser;
      //console.log('method resetCurrentUser()', $rootScope.currentUser);
    }

  };

/*
  function setCurrentUser (username) {
    $rootScope.currentUser = User.findByUsername(username);
    console.log('setCurrentUser('+username+') - $rootScope.currentUser:', $rootScope.currentUser);
  }
  function resetCurrentUser () {
    delete $rootScope.currentUser;
  }
*/

/*
  $rootScope.$on('$firebaseSimpleLogin:login', function (e, authUser) {
console.info('$on($firebaseSimpleLogin:login authUser:', authUser);
    var query = $firebase(ref.startAt(authUser.uid).endAt(authUser.uid));  
    query.$on('loaded', function () {
      var username = query.$getIndex()[0];
      if (!username) { // social provider, username not present
        username = authUser.displayName; // TODO: what do we use ad username for social providers?
      }
      //console.info('query.$on("loaded" ...:', username);
console.info('$on($firebaseSimpleLogin:login setCurrentUser(', username, ')');
      setCurrentUser(username);
    });
  });
*/
/*
  $rootScope.$on('$firebaseSimpleLogin:logout', function() {
    //console.info('Logout fired...');
    resetCurrentUser();
  });
*/
  return User;
});