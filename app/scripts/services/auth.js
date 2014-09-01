'use strict';
 
app.factory('Auth', function ($firebaseSimpleLogin, CFG, $rootScope) {
  var ref = new Firebase(CFG.FIREBASE_URL);

  var auth = $firebaseSimpleLogin(ref);

  var Auth = {
    register: function (user) {
      if (user !== null) {
        return auth.$createUser(user.email, user.password);
      }
    },
    signedIn: function () {
      if (auth.user !== null) {
        //console.log('auth.user:', auth.user, '$rootScope.currentUser:', $rootScope.currentUser);
        return true;
      }
      return false;
    },
    hasRole: function (roles) {
      console.info('hasRole()');
      if ((auth.user !== null) && $rootScope.currentUser && $rootScope.currentUser.roles) {
        /* jslint bitwise: true */
        if ((roles & CFG.ROLES.ADMIN) && $rootScope.currentUser.roles.admin) {
          //console.info('hasRole(admin) true');
          return true;
        }
        /* jslint bitwise: true */
        if ((roles & CFG.ROLES.EDIT_CUSTOMERS) && $rootScope.currentUser.roles.editCustomers) {
          //console.info('hasRole(edit_customers) true');
          return true;
        }
      }
      //console.info('hasRole() false');
      return false;
    },
    currentUser: function () {
      if (auth.user !== null) {
        return $rootScope.currentUser;
      }
      return null;
    },
    login: function (user) {
      //return auth.$login('password', user);
      /**/
      return auth.$login('password', {
        email: user.email,
        password: user.password,
        rememberMe: true
      });
      /**/
    },
    logout: function () {
      auth.$logout();
    },
    removeUser: function (user) { // TODO: test this
      auth.$removeUser(user.email, user.password, function(error) { // password is password_hash ?
        if (error === null) {
          console.log('User removed successfully');
        } else {
          console.log('Error removing user:', error);
        }
        return error;
      });
    },
    sendPasswordResetEmail: function (email) { // TODO: test this
      //console.info('auth:', auth, email);
      return auth.$sendPasswordResetEmail(email).then(
        null,
        function (error) {
          return error;
        }
      );
    }
  };

  $rootScope.signedIn = function () {
    return Auth.signedIn();
  };
 
  $rootScope.hasRole = function (role) {
    return Auth.hasRole(role);
  };

  return Auth;
});