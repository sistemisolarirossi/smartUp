'use strict';
 
app.factory('User', function ($rootScope, $firebase, $q, md5, CFG) {
  var users = $firebase(new Firebase(CFG.FIREBASE_URL + 'users')).$asObject();
  var usersByName = $firebase(new Firebase(CFG.FIREBASE_URL + 'usersByName')).$asObject();

  var avatarsBaseUrl = 'http://www.gravatar.com/avatar/';

  return {
  	all: users,
  	allByName: usersByName,
    create: function (user/*, password*/) {
      console.info('User - create() - user:', user);
/*
      if (!user.uid) { // should not happen...
        console.error('Can\'t create a user without a user id');
        var deferred = $q.defer();
        deferred.resolve('Can\'t create a user withut a user id');
        return deferred.promise;
      }
*/
      if (!user.username) { // TODO: can we use displayName for username (PROBABLY NOT!!!)
        user.username = user.displayName; // TODO: check if do we have displayName for all providers?
      }
      /* jshint camelcase: false */
      user.md5Hash = user.md5_hash; // we use only camelcase
      /* jshint camelcase: true */
      // get email and user's image url for each provider
      if (user.provider === 'google') {
        user.email = user.email; // ...
        if (user.thirdPartyUserData) {
	      user.imageUrl = user.thirdPartyUserData.picture;
	    }
      }
      if (user.provider === 'facebook') {
        user.email = user.thirdPartyUserData.email;
        user.imageUrl = user.thirdPartyUserData.picture.data.url;
      }
      if (user.provider === 'twitter') {
        user.email = null; // twitter does not return email
        /* jshint camelcase: false */
        user.imageUrl = user.thirdPartyUserData.entities.profile_image_url/*_https*/;
        /* jshint camelcase: true */
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
      //user.password = password; // save password to be able to allow administrators to remove user from firebase...

      var allow = false;
      if (user.email === CFG.SYSTEM_EMAIL) {
        allow = true;
      }
      user.roles = {
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
/*
      / * jshint camelcase: false * /
      // see instruction after this comment...
      users[user.uid] = {
        imageUrl: user.imageUrl,
        email: user.email,
        //password: user.password,
        username: user.username,
        provider: user.provider,
        id: user.id,
        uid: user.uid,// user unique id (among auth providers)
        isTemporaryPassword: user.isTemporaryPassword,
        //firebaseAuthToken: user.firebaseAuthToken, // TODO: do we need this value?
        roles: roles
      };
*/
      console.info('user uid:', user.uid);
      users[user.uid] = user; // add user to users array

      if (user.username) {
        // TODO: check if user already exists (social logins, for example) before overwriting...
      //usersByName.$child(user.username.toLowerCase()).$set(user.uid); // add to usersByName
        usersByName[user.username.toLowerCase()] = user.uid; // add to usersByName
      }
      console.info('saving users:', users);
      return users.$save(user.uid); // save user // TODO: CHECK THIS CODE!
    },
    find: function (uid) {
      //return this.all[uid];
      return users[uid];
    },
    findByUsername: function (username) { // DO NO HANDLE usersByName, to allow for common username among different users
      console.info('findByUsername() - username:', username);
      if (username) {
        return usersByName[username.toLowerCase()];
      }
    },
    getCurrent: function () {
      return $rootScope.currentUser;
    },
    delete: function (user) {
      if (!user.uid) {
        console.error('Can\'t delete a user without a user id');
        var deferred = $q.defer();
        deferred.resolve('Can\'t delete a user withut a user id');
        return deferred.promise;
      }
    //return users.$child(user.$id).$child('deleted').$set(true).then(
      return users[user.uid].$child('deleted').$set(true).then(
        function() {
          console.info('remove - then - success', user);
          // we do not delete user by usersByName, we just put a '_' sign before it's name
          usersByName.$remove(user.username.toLowerCase());
          usersByName['_' + user.username.toLowerCase()].$set(user.uid);
          return null;
        },
        function(error) {
          console.info('remove - then - error:', error.code);
          return error.code;
        }
      );
    },
    undelete: function (user) { // TODO: rethink user deletion/undeletion...
      //console.info('undelete() - USER:', user);
      if (!user.uid) {
        console.error('USER WITHOUT uid:', user);
        var deferred = $q.defer();
        deferred.resolve('No such user');
        return deferred.promise;
      }
/*
      return users[user.uid].$remove('deleted').then(
        function() {
          console.info('undelete - then - success', user);
          // we do not delete user by usersByName, we just put a '_' sign before it's name
          usersByName.$remove('_' + user.username.toLowerCase());
          usersByName.$child(user.username.toLowerCase()).$set(user.uid);
          return null;
        },
        function(error) {
          console.info('remove - then - error:', error.code);
          return error.code;
        }
      );
*/
    },
    signedIn: function () {
      return $rootScope.currentUser !== undefined;
    },
    setCurrentUser: function (user) {
      $rootScope.currentUser = user;
    },
    resetCurrentUser: function () {
      delete $rootScope.currentUser;
    }
  };
});