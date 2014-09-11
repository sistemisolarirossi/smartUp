'use strict';
 
app.factory('User', function ($rootScope, $firebase, CFG) {
  var refUsers = new Firebase(CFG.FIREBASE_URL + 'users');
  var users = $firebase(refUsers);
  var refUsersByName = new Firebase(CFG.FIREBASE_URL + 'usersByName');
  var usersByName = $firebase(refUsersByName);

  var User = {
    create: function (user) {
      //console.info('user:', user);
      // TODO: check if user already exists (social logins, for example) before overwriting...
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
      User.setCurrentUser(user);
      usersByName.$child(user.username.toLowerCase()).$set(user.uid);
      return users.$save(user.uid);
    },
    findByUsername: function (username) {
      if (username) {
        return users[usersByName[username.toLowerCase()]];
//    } else {
//      return null;
      }
    },
    findByUid: function (uid) {
      if (uid) {
        return users[uid];
      }
    },
    getCurrent: function () {
      return $rootScope.currentUser;
    },
    delete: function (uid) {
      console.info('deleting user', uid);
      // TODO: implement it...
      //delete users[uid]
      //delete usersByName[uid]
    },
    signedIn: function () {
      //$log.info('$rootScope.currentUser:', $rootScope.currentUser);
      return $rootScope.currentUser !== undefined;
    },
    setCurrentUser: function (user) {
      $rootScope.currentUser = user; //User.findByUsername(username);
      //$log.log('method setCurrentUser('+user.uid+') - $rootScope.currentUser:', $rootScope.currentUser.uid);
    },
    resetCurrentUser: function () {
      delete $rootScope.currentUser;
      //$log.log('method resetCurrentUser()', $rootScope.currentUser);
    }

  };

  $rootScope.$on('$firebaseSimpleLogin:login', function (e, authUser) {
    var query = $firebase(refUsers.startAt(authUser.username).endAt(authUser.username));
    query.$on('loaded', function () {
      var uid = query.$getIndex()[0];
      var user = User.findByUid(uid);
      User.setCurrentUser(user);
    });
  });

  $rootScope.$on('$firebaseSimpleLogin:logout', function() {
    User.resetCurrentUser();
  });

  return User;

});