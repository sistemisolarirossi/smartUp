'use strict';
 
app.factory('User', function ($rootScope, $firebase, $q, CFG, md5) {
  var refUsers = new Firebase(CFG.FIREBASE_URL + 'users');
  var users = $firebase(refUsers);
  var refUsersByName = new Firebase(CFG.FIREBASE_URL + 'usersByName');
  var usersByName = $firebase(refUsersByName);
  var avatarsBaseUrl = 'http://www.gravatar.com/avatar/';

  var User = {
    all: users,
    create: function (user, password) {
      console.info('User - create() - user:', user);
      if (!user.uid) { // TODO: defer error...
        // ...
        console.error('can\'t create a user without a uid!');
        return false;
      }
      if (!user.username) { // TODO: can we use displayName for username (PROBABLY NOT!!!)
        user.username = user.displayName; // TODO: check if do we have displayName for all providers?
        /* jshint camelcase: false */
      }
      user.md5Hash = user.md5_hash; // we use only camelcase
      // TODO: do we have a provider field in user?
      // get email and user's image url for each provider
      if (user.provider === 'google') {
        user.email = user.email; // ...
        user.imageUrl = user.thirdPartyUserData.picture;
      }
      if (user.provider === 'facebook') {
        user.email = user.thirdPartyUserData.email;
        user.imageUrl = user.thirdPartyUserData.picture.data.url;
      }
      if (user.provider === 'twitter') {
        user.email = null; // twitter does not return email
        /* jshint camelcase: false */
        user.imageUrl = user.thirdPartyUserData.entities.profile_image_url/*_https*/;
      }
      if (!user.imageUrl) { // we use gravatars for 'password' logins and for providers without imageUrl
        user.imageUrl = avatarsBaseUrl;
        if (user.email) {
          if (!user.md5Hash) {
            user.md5Hash = md5.createHash(user.email);
          }
          user.imageUrl += user.md5Hash;
        }
      }
      user.password = password; // save password to be able to allow administrators to remove user from firebase...

      var allow = false;
      if (user.email === CFG.SYSTEM_EMAIL) {
        allow = true;
      }
      var roles = {
        'users': {
          'read': allow,
          'write': allow
        },
        'customers': {
          'read': allow,
          'write': allow
        },
        'orders': {
          'read': allow,
          'write': allow
        },
        'servicereports': {
          'read': allow,
          'write': allow
        }
      };

      // TODO: check if user already exists (social logins, for example) before overwriting...
      /* jshint camelcase: false */
      users[user.uid] = {
        imageUrl: user.imageUrl,
        email: user.email,
        password: user.password,
        username: user.username,
        provider: user.provider,
        id: user.id,
        uid: user.uid,// user unique id (among auth providers)
        isTemporaryPassword: user.isTemporaryPassword,
        //firebaseAuthToken: user.firebaseAuthToken, // TODO: do we need this value?
        roles: roles
      };
      // TODO: use this, instead...:
      // users[user.uid] = user;

      //User.setCurrentUser(user); // set current user id done in $rootScope.$on()...
      if (user.username) {
        usersByName.$child(user.username.toLowerCase()).$set(user.uid); // add to usersByName
      }
      return users.$save(user.uid); // save user
    },
    set: function(userId, user) {
      console.log('set user:', user);
      /* DO NO HANDLE usersByName, to allow for common username among different users */
      var oldusername = users.$child(userId).username;
      if (user.username !== oldusername) {
        usersByName.$remove(oldusername);
      }
      usersByName.$child(user.username.toLowerCase()).$set(userId);
      delete user.$id; // you can't set an item with a property starting with '$'... TODO: deepen this fact...
      return users.$child(userId).$set(user);
    },
    findByUsername: function (username) { // DO NO HANDLE usersByName, to allow for common username among different users
      if (username) {
        return users[usersByName[username.toLowerCase()]];
      }
    },
    /*
    findByUid: function (uid) {
      if (uid) {
        return users[uid];
      }
    },
    */
    find: function (userId) {
      return users.$child(userId);
    },
    getCurrent: function () {
      return $rootScope.currentUser;
    },
    delete: function (user) {
      // TODO: implement it...
      //delete users[uid]
      //delete usersByName[uid]
      if (!user.$id) {
        console.error('USER WITHOUT $ID:', user);
        var deferred = $q.defer();
        deferred.resolve('No such user');
        return deferred.promise;
      }
      //user.deleted = true;
      return users.$child(user.$id).$child('deleted').$set(true).then(
        function() {
          console.info('remove - then - success', user);
          usersByName.$remove(user.username.toLowerCase());
          return null;
        },
        function(error) {
          console.info('remove - then - error:', error.code);
          return error.code;
        }
      );
    },
    signedIn: function () {
      return $rootScope.currentUser !== undefined;
    },
    setCurrentUser: function (user) {
      $rootScope.currentUser = user; //User.findByUsername(username);
    },
    resetCurrentUser: function () {
      delete $rootScope.currentUser;
    }

  };

  $rootScope.$on('$firebaseSimpleLogin:login', function (event, authUser) {
    console.warn('$rootScope.$on($firebaseSimpleLogin:login) FIRED - authUser:', authUser);
    if (!authUser.uid) {
      toastr.error('Error logging in user');
      console.error('login fired with an authorized user with no uid!', authUser);
      return User.resetCurrentUser();
    }

    //var user = User.findByUid(authUser.uid);
    var user = User.find(authUser.uid);
    if (user) { 
      User.setCurrentUser(user);
    } else {
      // first social login, user not yet created
    }
  });

  $rootScope.$on('$firebaseSimpleLogin:logout', function() {
    User.resetCurrentUser();
  });

  return User;

});