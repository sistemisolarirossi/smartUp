"use strict";function logEvent(a){var b,c,d,e;b=navigator.onLine?"yes":"no",c=cacheStatusValues[cache.status],d=a.type,e="online: "+b,e+=", event: "+d,e+=", status: "+c,"error"===d&&navigator.onLine&&(e+=" (probably a syntax error in manifest)"),console.log(e)}function capitalizeAllWords(a){for(var b=a.split(" "),c=0;c<b.length;c++){var d=b[c].charAt(0).toUpperCase();b[c]=d+b[c].substr(1)}return b.join(" ")}function formatDuration(a){var b=a.replace(/\./g,":"),c=b.indexOf(":");return c>=0?b.substr(c+1).length<=1&&(b=b.substr(0,c+1)+"0"+b.substr(c+1)):b+=":00",b}var app=angular.module("smartUpApp",["ngSanitize","ngRoute","ngAutocomplete","firebase","ui.bootstrap","angular-md5"]);app.constant("CFG",{FIREBASE_URL:"https://smartup.firebaseio.com/",ROLES:{ADMIN:1,EDIT_CUSTOMERS:2},SYSTEM_EMAIL:"sistemisolarirossi@gmail.com",DEBUG:!0}),app.config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/home.html",controller:"AuthCtrl"}).when("/register",{templateUrl:"views/register.html",controller:"AuthCtrl"}).when("/login",{templateUrl:"views/login.html",controller:"AuthCtrl"}).when("/login/:authType",{templateUrl:"views/login.html",controller:"AuthCtrl"}).when("/customers",{templateUrl:"views/customers.html",controller:"CustomersCtrl"}).when("/orders",{templateUrl:"views/orders.html",controller:"OrdersCtrl"}).when("/orders/:orderId",{templateUrl:"views/showorder.html",controller:"OrderViewCtrl"}).when("/servicereports",{templateUrl:"views/serviceReports.html"}).when("/contacts",{templateUrl:"views/contacts.html",controller:"ContactsCtrl"}).when("/about",{templateUrl:"views/about.html",controller:"AboutCtrl"}).when("/users",{templateUrl:"views/users.html",controller:"UsersCtrl"}).when("/users/:username",{templateUrl:"views/users.html",controller:"UsersCtrl"}).otherwise({redirectTo:"/"})}]),app.config(["datepickerConfig","datepickerPopupConfig",function(a,b){b.showButtonBar=!1}]),app.run(["$templateCache",function(a){a.put("template/timepicker/timepicker.html",'<table> <tbody>   <tr>     <td style="width: 3.0em;" class="form-group" ng-class="{\'has-error\': invalidHours}">       <input type="text" ng-model="hours" ng-change="updateHours()" class="form-control text-center" ng-mousewheel="incrementHours()" ng-readonly="readonlyInput" maxlength="2">     </td>     <td></td>     <td style="width: 3.0em;" class="form-group" ng-class="{\'has-error\': invalidMinutes}">       <input type="text" ng-model="minutes" ng-change="updateMinutes()" class="form-control text-center" ng-readonly="readonlyInput" maxlength="2">     </td>     <td ng-show="showMeridian"><button type="button" class="btn btn-default text-center" ng-click="toggleMeridian()">{{meridian}}</button></td>   </tr> </tbody></table>')}]),app.run(["$window","$rootScope",function(a,b){b.online=navigator.onLine,a.addEventListener("offline",function(){b.$apply(function(){b.online=!1})},!1),a.addEventListener("online",function(){b.$apply(function(){b.online=!0})},!1)}]);var beforePrint=function(){console.log("Functionality to run before printing.")},afterPrint=function(){console.log("Functionality to run after printing")};if(window.matchMedia){var mediaQueryList=window.matchMedia("print");mediaQueryList.addListener(function(a){a.matches?beforePrint():afterPrint()})}window.onbeforeprint=beforePrint,window.onafterprint=afterPrint;var cacheStatusValues=[];cacheStatusValues[0]="uncached",cacheStatusValues[1]="idle",cacheStatusValues[2]="checking",cacheStatusValues[3]="downloading",cacheStatusValues[4]="updateready",cacheStatusValues[5]="obsolete";var cache=window.applicationCache;cache.addEventListener("cached",logEvent,!1),cache.addEventListener("checking",logEvent,!1),cache.addEventListener("downloading",logEvent,!1),cache.addEventListener("error",logEvent,!1),cache.addEventListener("noupdate",logEvent,!1),cache.addEventListener("obsolete",logEvent,!1),cache.addEventListener("progress",logEvent,!1),cache.addEventListener("updateready",logEvent,!1),window.applicationCache.addEventListener("updateready",function(){window.applicationCache.swapCache(),console.log("swap cache has been called")},!1),setInterval(function(){cache.update()},15e3),app.controller("HomeCtrl",["$rootScope",function(a){a.formLabel=""}]),app.controller("AuthCtrl",["$scope","$rootScope","$routeParams","$location","CFG","Auth","User",function(a,b,c,d,e,f,g){b.formLabel="",f.signedIn()&&d.path("/"),a.params=c,a.error=null,a.info=null,a.test=1,a.debug=e.DEBUG,console.log(a.debug),a.register=function(b){console.info("controller - register"),a.$broadcast("autofillFix:update"),a.formRegisterSubmitted=!0,b&&(console.info("controller - register - valid",a.user),a.user?f.register(a.user).then(function(b){console.info("registered user:",b.user),b.user.username=a.user.username,g.create(b.user).then(function(){d.path("/")},function(a){toastr.error("Couldn't create user "+b.user.username),console.error("Couldn't create user ",b.user,":",a)})},function(b){a.error="Sorry, could not register user ("+b.message+")",console.error("Register error:",b.message)}):a.error="Please specify user's data")},a.login=function(){a.$broadcast("autofillFix:update"),a.user&&a.user.usernameOrEmail&&a.user.password?f.login(a.user).then(function(b){if(console.warn("Auth.login($scope.user).then() RETURNED - authUser:",b),b){var c=g.findByUid(b.uid);g.setCurrentUser(c),d.path("/")}else a.error="Please specify an existing username/email"},function(b){a.error="Login failed ("+b.message+")"}):a.user?a.user.usernameOrEmail?a.user.password||(a.error="Please specify a password"):a.error="Please specify a username/email":a.error="Please specify a username/email and password"},a.loginSocial=function(a){f.loginSocial(a).then(function(a){g.create(a).then(function(){var b=g.findByUid(a.uid);g.setCurrentUser(b)},function(b){toastr.error("Couldn't create user "+a.username),console.error("Couldn't create user "+a+":",b)})},function(b){console.error="loginSocial("+a+") failed ("+b.message+")",toastr.error="loginSocial("+a+") failed ("+b.message+")"})},a.logout=function(){g.resetCurrentUser(),f.logout(),b.formLabel="",d.path("/")},a.sendPasswordResetEmail=function(b){a.reset(),f.sendPasswordResetEmail(b).then(function(b){"undefined"==typeof b?(toastr.info("Password sent"),a.info="An email with a temporary password has been sent to your email: use it to login and then change it."):a.error="INVALID_EMAIL"===b.code?"Please specify a valid email":"INVALID_USER"===b.code?"Sorry, this is not a registered email":"Sorry, could not send password email ("+b.message+"). Please retry later."})},a.reset=function(){a.error=null,a.info=null},a.reset()}]),app.controller("OrdersCtrl",["$scope","$location","Order",function(a,b,c){"/orders"===b.path()&&(a.orders=c.all);var d=new Date;a.orderPlaceholder={url:"http://",title:""},a.orderPlaceholder={customer:"",title:"",date:d,delivery:""},a.order=a.orderPlaceholder,a.submitOrder=function(){c.create(a.order).then(function(c){a.order=a.orderPlaceholder,b.path("/orders/"+c)})},a.deleteOrder=function(a){c.delete(a)}}]),app.controller("CustomersCtrl",["$scope","$rootScope","$location","CFG","Customer",function(a,b,c,d,e){b.formLabel="Customers",a.customer={},a.customers=e.all,a.CFG=d,a.initCustomer=function(){a.customer.name=null,a.customer.cfpiva=null,a.customer.address=null,a.customer.phone=null,a.customer.email=null,a.customer.dateCreation=null,a.formAddEditSubmitted=!1,a.currentId=null,a.addMode=!1,a.editMode=!1,a.printMode=!1,a.orderby="name",a.autocompleteAddressResult="",a.autocompleteAddressOptions=null,a.autocompleteAddressDetails=""},a.submitCustomer=function(b){a.formAddEditSubmitted=!0,b&&(a.customer.dateCreation=new Date,a.editMode&&e.set(a.currentId,a.customer).then(function(){}),a.addMode&&e.create(a.customer).then(function(){}),a.addMode=a.editMode=!1,a.formAddEditSubmitted=!1)},a.cancelCustomer=function(){a.initCustomer()},a.deleteCustomer=function(a){e.delete(a.$id).then(function(a){a?(console.info("deleteCustomer - error",a.replace(/_/," ")),toastr.error("Customer not deleted: "+a.replace(/_/," "))):(console.info("deleteCustomer - success"),toastr.info("Customer deleted"))})},a.addCustomer=function(){a.initCustomer(),a.addMode=!0},a.currentUserCanRead=function(){return b.currentUser&&b.currentUser.roles&&b.currentUser.roles.customers?b.currentUser.roles.customers.read:!1},a.currentUserCanWrite=function(){return console.info("currentUserCanWrite"),b.currentUser?(console.info("currentUserCanWrite - currentUser is set"),console.info("currentUserCanWrite - currentUser:",b.currentUser),b.currentUser.roles&&b.currentUser.roles.customers?(console.info("currentUserCanWrite - currentUser.roles.write.customers:",b.currentUser.roles.customers.write),console.info("currentUserCanWrite - retval:",b.currentUser.roles.customers.write),b.currentUser.roles.customers.write):(console.info("currentUserCanWrite - returning FALSE (no customers roles on user)"),!1)):(console.info("currentUserCanWrite - returning FALSE"),!1)},a.editCustomer=function(b){if(a.editMode)a.editMode=!1;else{var c=b.$id;a.currentId=c,a.customer=e.find(c),a.editMode=!0}},a.preprintCustomer=function(b){var c=b.$id;a.printMode?a.printMode=!1:(a.currentId=c,a.customer=e.find(c),console.info("Preprint $scope.customer:",c,a.customer),a.printMode=!0)},a.printCustomer=function(){a.printMode&&(a.print(),window.onafterprint=function(){console.log("Printing dialog closed..."),a.printMode=!1,a.$apply()})},a.print=function(){setTimeout(function(){window.print()},0)},a.initCustomer()}]),app.controller("ServicereportsCtrl",["$scope","$rootScope","$location","Servicereport","Customer","Auth","DateTime",function(a,b,c,d,e,f,g){b.formLabel="Service Reports",a.servicereport={},a.servicereports=d.all,a.customersById={},a.customers=e.all,a.customers.$on("loaded",function(){angular.forEach(a.customers,function(b,c){"object"==typeof b&&(a.customersById[c]=b)})}),a.$watch(f.currentUser,function(b){b&&(a.servicereport.operator=a.currentUser.username)},!0),a.servicereports.$on("loaded",function(){a.servicereport.number=d.getNumberNext()}),a.initServicereport=function(){a.servicereport.operator=a.currentUser?a.currentUser.username:null,a.servicereport.dateIn=new Date,a.servicereport.dateOut=a.servicereport.dateIn,a.servicereport.duration=null,a.servicereport.location=null,a.servicereport.notes=null,a.servicereport.dateCreation=null,a.customer=null,a.formAddEditSubmitted=!1,a.currentId=null,a.addMode=!1,a.editMode=!1,a.printMode=!1,a.orderby="-number",a.dateInit()},a.submitServicereport=function(b){a.formAddEditSubmitted=!0,b&&(a.servicereport.customerId=a.customer.$id,a.servicereport.dateCreation=new Date,a.setDateOut(),a.editMode&&d.set(a.currentId,a.servicereport).then(function(){}),a.addMode&&d.create(a.servicereport).then(function(){}),a.addMode=a.editMode=!1,a.formAddEditSubmitted=!1)},a.cancelServicereport=function(){a.addMode&&(a.servicereport.number=d.resetNumberNext()),a.initServicereport()},a.deleteServicereport=function(a){var b=a.$id;d.delete(b)},a.addServicereport=function(){a.initServicereport(),a.addMode=!0,a.servicereport.number=d.setNumberNext()},a.editServicereport=function(b){if(a.editMode)a.editMode=!1;else{var c=b.$id;a.currentId=c,a.servicereport=d.find(c),a.customer=e.find(a.servicereport.customerId),console.info("EDIT $scope.servicereport:",c,a.servicereport),a.editMode=!0}},a.preprintServicereport=function(b){var c=b.$id;a.printMode?a.printMode=!1:(a.currentId=c,a.servicereport=d.find(c),a.customer=e.find(a.servicereport.customerId),console.info("Preprint $scope.servicereport:",c,a.servicereport),a.printMode=!0)},a.printServicereport=function(){a.printMode&&(a.print(),window.onafterprint=function(){console.log("Printing dialog closed..."),a.printMode=!1,a.$apply()})},a.dateInit=function(){a.dateMin=null,a.dateMax=null,a.dateFormat="dd MMMM yyyy",a.dateOptions={formatYear:"yyyy",startingDay:1,showWeeks:!1},a.hourStep=1,a.minuteStep=1,a.showMeridian=!1,a.servicereport.dateIn=new Date,a.servicereport.dateOut=a.servicereport.dateIn,a.timeIn=a.servicereport.dateIn,a.servicereport.dateIn.setHours(a.timeIn.getHours()),a.servicereport.dateIn.setMinutes(a.timeIn.getMinutes()),a.servicereport.dateIn.setSeconds(0),a.dateDisabled=function(){return!1},a.dateOpen=function(b){b.preventDefault(),b.stopPropagation(),a.dateOpened=!0},a.timeChanged=function(){console.info("dateIn without time set:",a.servicereport.dateIn),console.info("timeChanged:",a.timeIn.getHours(),a.timeIn.getMinutes()),a.servicereport.dateIn.setHours(a.timeIn.getHours()),a.servicereport.dateIn.setMinutes(a.timeIn.getMinutes()),a.servicereport.dateIn.setSeconds(0),console.info("dateIn with time set:",a.servicereport.dateIn)}},a.setDateOut=function(){var b=new g(a.servicereport.dateOut),c=a.servicereport.duration.split(":");b.addHours(c[0]||0),b.addMinutes(c[1]||0),a.servicereport.dateOut=b.get()},a.getCustomers=function(a){return console.info("getCustomers() - viewValue:",a),e.all},a.onCustomerSelect=function(b,c,d){console.info("onCustomerSelect() - item, model, label:",b,c,d),console.info("item:",b),a.customer=b,a.servicereport.location=b.address},a.print=function(){setTimeout(function(){window.print()},0)},a.initServicereport()}]),app.controller("ContactsCtrl",["$rootScope",function(a){a.formLabel="Contacts"}]),app.controller("AboutCtrl",["$rootScope",function(a){a.formLabel="About"}]),app.controller("OrderViewCtrl",["$scope","$routeParams","Order",function(a,b,c){a.order=c.find(b.orderId),a.addItem=function(){c.addItem(b.orderId,a.item),a.item=""},a.deleteItem=function(b,d){c.deleteItem(a.order,b,d)}}]),app.controller("UsersCtrl",["$scope","$rootScope","$routeParams","$location","User",function(a,b,c,d,e){b.formLabel="Users",a.roles=[{key:"u",desc:"users"},{key:"c",desc:"customers"},{key:"o",desc:"orders"},{key:"s",desc:"service reports"}],a.user=c.username?e.findByUsername(c.username):{},a.users=e.all,console.info("users: ",a.users),a.currentUserCanRead=function(){return b.currentUser&&b.currentUser.roles&&b.currentUser.roles.users?b.currentUser.roles.users.read:!1},a.currentUserCanWrite=function(){return console.info("currentUserCanWrite"),b.currentUser?(console.info("currentUserCanWrite - currentUser is set"),console.info("currentUserCanWrite - currentUser:",b.currentUser),b.currentUser.roles&&b.currentUser.roles.users?(console.info("currentUserCanWrite - currentUser.roles.write.users:",b.currentUser.roles.users.write),console.info("currentUserCanWrite - retval:",b.currentUser.roles.users.write),b.currentUser.roles.users.write):(console.info("currentUserCanWrite - returning FALSE (no users roles on user)"),!1)):(console.info("currentUserCanWrite - returning FALSE"),!1)}}]),app.controller("ModalInstanceCtrl",["$scope","$modalInstance",function(a,b){a.ok=function(){b.close()},a.cancel=function(){b.dismiss("cancel")}}]),app.factory("Auth",["$rootScope","$firebase","$firebaseSimpleLogin","$q","CFG","User",function(a,b,c,d,e,f){var g=new Firebase(e.FIREBASE_URL),h=c(g),i={register:function(a){return h.$createUser(a.email,a.password)},signedIn:function(){return null!==h.user&&a.currentUser?!0:void 0},hasRole:function(b){if(null!==h.user&&a.currentUser&&a.currentUser.roles){if(b&e.ROLES.ADMIN&&a.currentUser.roles.admin)return!0;if(b&e.ROLES.EDIT_CUSTOMERS&&a.currentUser.roles.editCustomers)return!0}return!1},currentUser:function(){return null!==h.user?a.currentUser:void 0},login:function(a){if(a.usernameOrEmail&&-1!==a.usernameOrEmail.indexOf("@"))a.email=a.usernameOrEmail;else{var b=f.findByUsername(a.usernameOrEmail);if(!b||!b.email){console.warn("return defer error");var c=d.defer();return c.resolve(null),c.promise}a.email=b.email}return h.$login("password",{email:a.email,password:a.password,rememberMe:!0,debug:e.DEBUG})},loginSocial:function(a){return h.$login(a,{rememberMe:!0,scope:"google"===a?"https://www.googleapis.com/auth/userinfo.profile":"facebook"===a?"email":null,oauth_token:"twitter"===a?"true":null,preferRedirect:!1})},logout:function(){h.$logout()},"delete":function(a){h.$removeUser(a.email,a.password,function(a){return null===a?console.info("User removed successfully"):(toastr.log("Error removing user: "+a.message),console.error("Error removing user:",a)),a})},sendPasswordResetEmail:function(a){return h.$sendPasswordResetEmail(a).then(null,function(a){return a})}};return a.signedIn=function(){return i.signedIn()},a.hasRole=function(a){return i.hasRole(a)},i}]),app.factory("Order",["$firebase","FIREBASE_URL","User",function(a,b,c){var d=new Firebase(b+"orders"),e=a(d),f={all:e,create:function(a){if(c.signedIn()){var b=c.getCurrent();return a.owner=b.username,e.$add(a).then(function(a){var c=a.name();return b.$child("orders").$child(c).$set(c),c})}},find:function(a){return e.$child(a)},"delete":function(a){if(c.signedIn()){var b=f.find(a);b.$on("loaded",function(){var d=c.findByUsername(b.owner);e.$remove(a).then(function(){d.$child("orders").$remove(a)})})}},addItem:function(a,b){if(c.signedIn()){var d=c.getCurrent();b.username=d.username,b.orderId=a,e.$child(a).$child("items").$add(b).then(function(b){d.$child("items").$child(b.name()).$set({id:b.name(),orderId:a})})}},deleteItem:function(a,b,d){if(c.signedIn()){var e=c.findByUsername(b.username);a.$child("items").$remove(d).then(function(){e.$child("items").$remove(d)})}}};return f}]),app.factory("Customer",["$firebase","CFG","User","$q",function(a,b,c,d){var e=new Firebase(b.FIREBASE_URL+"customers"),f=a(e),g=new Firebase(b.FIREBASE_URL+"customersByName"),h=a(g),i={all:f,create:function(a){return f.$add(a).then(function(b){var c=b.name();return h.$child(a.name.toLowerCase()).$set(c),console.info("customersByName:",h),c})},set:function(a,b){var c=f.$child(a).name;return b.name!==c&&h.$remove(c),h.$child(b.name.toLowerCase()).$set(a),f.$child(a).$set(b)},find:function(a){return f.$child(a)},findByName:function(a){return a?h[a.toLowerCase()]:void 0},"delete":function(a){var b=i.find(a);if(!b.name){var c=d.defer();return c.resolve("NO SUCH CUSTOMER ID"),c.promise}return b.deleted=!0,f.$child(a).$set(b).then(function(a){return console.info("remove - then - success",a,b),h.$remove(b.name.toLowerCase()),null},function(a){return console.info("remove - then - error:",a.code),a.code})}};return i}]),app.factory("Servicereport",["$firebase","CFG","User",function(a,b,c){var d=new Firebase(b.FIREBASE_URL+"servicereports"),e=a(d),f={all:e,create:function(a){if(c.signedIn()){var b=c.getCurrent();return a.operator=b.username,e.$add(a).then(function(a){var b=a.name();return b})}},set:function(a,b){return e.$child(a).$set(b)},find:function(a){return e.$child(a)},getNumberNext:function(){var a=e.$child("stash").serviceReportNumber;return a=a?a:1},setNumberNext:function(){var a=e.$child("stash").serviceReportNumber;return a=a?a+1:1,e.$child("stash").$set({serviceReportNumber:a}),a},resetNumberNext:function(){var a=e.$child("stash").serviceReportNumber;return a=a&&a>1?a-1:1,e.$child("stash").$set({serviceReportNumber:a}),a},"delete":function(a){if(c.signedIn()){console.info("DELETE",a);var b=f.find(a);b.$on("loaded",function(){console.info("set delete to true servicereport with id:",a);var b=f.find(a);b.deleted=!0,b.$on("loaded",function(){e.$child(a).$set(b)})})}}};return f}]),app.factory("User",["$rootScope","$firebase","CFG","md5",function(a,b,c,d){var e=new Firebase(c.FIREBASE_URL+"users"),f=b(e),g=new Firebase(c.FIREBASE_URL+"usersByName"),h=b(g),i="http://www.gravatar.com/avatar/",j={all:f,create:function(a){if(console.info("User - create() - user:",a),!a.uid)return console.error("can't create a user without a uid!"),!1;a.username||(a.username=a.displayName),a.md5Hash=a.md5_hash,"google"===a.provider&&(a.email=a.email,a.imageUrl=a.thirdPartyUserData.picture),"facebook"===a.provider&&(a.email=a.thirdPartyUserData.email,a.imageUrl=a.thirdPartyUserData.picture.data.url),"twitter"===a.provider&&(a.email=null,a.imageUrl=a.thirdPartyUserData.entities.profile_image_url),a.imageUrl||(a.imageUrl=i,a.email&&(a.md5Hash||(a.md5Hash=d.createHash(a.email)),a.imageUrl+=a.md5Hash));var b={};return a.email===c.SYSTEM_EMAIL&&(b={users:{read:!0,write:!0},customers:{read:!0,write:!0}}),f[a.uid]={imageUrl:a.imageUrl,email:a.email,username:a.username,provider:a.provider,id:a.id,uid:a.uid,isTemporaryPassword:a.isTemporaryPassword,roles:b},a.username&&h.$child(a.username.toLowerCase()).$set(a.uid),f.$save(a.uid)},findByUsername:function(a){return a?f[h[a]]:void 0},findByUid:function(a){return a?f[a]:void 0},getCurrent:function(){return a.currentUser},"delete":function(a){console.info("deleting user",a)},signedIn:function(){return void 0!==a.currentUser},setCurrentUser:function(b){a.currentUser=b},resetCurrentUser:function(){delete a.currentUser}};return a.$on("$firebaseSimpleLogin:login",function(a,b){if(!b.uid)return toastr.error("Error logging in user"),console.error("login fired with an authorized user with no uid!",b),j.resetCurrentUser();var c=j.findByUid(b.uid);c&&j.setCurrentUser(c)}),a.$on("$firebaseSimpleLogin:logout",function(){j.resetCurrentUser()}),j}]),app.factory("Toaster",["$timeout",function(a){function b(a){d[a]=""}function c(){for(var a="",b=0;b<arguments.length;b++)a+=(b>0?" ":"")+JSON.stringify(arguments[b]);return a.replace(/^"/g,"").replace(/"$/g,"").replace(/\\/g,"")}toastr.options={closeButton:!1,debug:!1,positionClass:"toast-top-right",onclick:null,showDuration:"300",hideDuration:"1000",timeOut:"3500",extendedTimeOut:"1000",showEasing:"swing",hideEasing:"linear",showMethod:"fadeIn",hideMethod:"fadeOut"};var d=[];return{success:function(){var e=c.apply(this,arguments);d.success!==e&&(toastr.success(e),a(function(){b("success")},toastr.options.timeOut,!1),d.success=e)},info:function(){var e=c.apply(this,arguments);d.info!==e&&(toastr.info(e),a(function(){b("info")},toastr.options.timeOut,!1),d.info=e)},warning:function(){var e=c.apply(this,arguments);d.warning!==e&&(toastr.warning(e),a(function(){b("warning")},toastr.options.timeOut,!1),d.warning=e)},error:function(){var e=c.apply(this,arguments);d.error!==e&&(toastr.error(e),a(function(){b("error")},toastr.options.timeOut,!1),d.error=e)}}}]),app.factory("DateTime",function(){function a(a){void 0===a&&(this.date=new Date),this.date="[object Date]"===Object.prototype.toString.call(a)?a:new Date(a)}return a.prototype.get=function(){return this.date},a.prototype.addHours=function(a){this.date.setHours(this.date.getHours()+parseInt(a))},a.prototype.addMinutes=function(a){this.date.setMinutes(this.date.getMinutes()+parseInt(a))},a}),app.directive("navCollapse",function(){return{restrict:"A",link:function(a,b){var c=!1;b.on("show.bs.collapse",function(){c=!0}),b.on("hide.bs.collapse",function(){c=!1}),b.on("click",function(){c&&"auto"===b.css("overflow-y")&&b.collapse("hide")})}}}),app.directive("autofillFix",function(){return{require:"ngModel",link:function(a,b,c,d){a.$on("autofillFix:update",function(){d.$setViewValue(b.val())})}}}),app.directive("autofocus",["$timeout",function(a){return{replace:!1,link:function(b,c,d){b.$watch(d.autofocus,function(b){b&&a(function(){c[0].focus()})})}}}]),app.directive("equals",function(){return{restrict:"A",require:"?ngModel",link:function(a,b,c,d){if(d){a.$watch(c.ngModel,function(){e()}),c.$observe("equals",function(){e()});var e=function(){var a=d.$viewValue,b=c.equals;d.$setValidity("equals",!(a&&b)||a===b)}}}}}),app.directive("reallyClick",["$modal",function(a){return{restrict:"A",scope:{reallyClick:"&",item:"="},link:function(b,c,d){c.bind("click",function(){var c=d.reallyMessage||"Are you sure?",e='<div class="modal-body">'+c+"</div>";e+='<div class="modal-footer"><button class="btn btn-primary" ng-click="ok()">OK</button><button class="btn btn-warning" ng-click="cancel()">Cancel</button></div>';var f=a.open({template:e,controller:"ModalInstanceCtrl"});f.result.then(function(){b.reallyClick({item:b.item})},function(){})})}}}]),app.directive("checkNotEmpty",function(){return{require:"ngModel",link:function(a,b,c,d){var e;d.$parsers.unshift(function(a){return a&&""!==a?(d.$setValidity("notempty",!0),e=a):d.$setValidity("notempty",!1),e})}}}),app.directive("checkUserName",["User",function(a){return{require:"ngModel",scope:{value:"=ngModel"},link:function(b,c,d,e){var f=/^[^.$\[\]#\/\s]+$/;e.$parsers.unshift(function(b){var c;return b&&(c=a.findByUsername(b),c&&console.warn("checkUserName directive FOUND User.findByUsername("+b+"):",c)),f.test(b)?c?(e.$setValidity("taken",!1),void e.$setValidity("invalid",!0)):(e.$setValidity("taken",!0),e.$setValidity("invalid",!0),b):(e.$setValidity("taken",!0),void e.$setValidity("invalid",""===b))}),c.bind("blur",function(){e.$viewValue&&(e.$viewValue=capitalizeAllWords(e.$viewValue),e.$render())})}}}]),app.directive("checkDuration",function(){return{require:"ngModel",scope:{value:"=ngModel"},link:function(a,b,c,d){var e=/^\d+$/,f=/^\d+[:.]\d+$/;d.$parsers.unshift(function(a){var b=-1,c=-1;if(e.test(a))b=parseInt(a),c=0;else if(f.test(a)){var g=a.split(/\s*[:.]\s*/);b=parseInt(g[0]),c=parseInt(g[1]),c>=60&&(b=c=-1)}var h=60*b+c;return h>0?(d.$setValidity("duration",!0),a):void d.$setValidity("duration",!1)}),b.bind("blur",function(){d.$viewValue&&(d.$viewValue=formatDuration(d.$viewValue),d.$render())})}}}),app.directive("checkCustomerName",["Customer",function(a){return{require:"ngModel",scope:{value:"=ngModel"},link:function(b,c,d,e){var f,g=/^([ \u00c0-\u01ffa-zA-Z'\-])+$/;e.$parsers.unshift(function(b){if(g.test(b)){var c=d.customerId,h=a.findByName(b);h&&h!==c?(e.$setValidity("taken",!1),e.$setValidity("invalid",!0)):(e.$setValidity("taken",!0),e.$setValidity("invalid",!0),f=b)}else e.$setValidity("taken",!0),e.$setValidity("invalid",!1);return f}),c.bind("blur",function(){e.$viewValue&&(e.$viewValue=capitalizeAllWords(e.$viewValue),e.$render())})}}}]),app.directive("checkEmail",function(){return{require:"ngModel",scope:{value:"=ngModel"},link:function(a,b,c,d){var e=/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;d.$parsers.unshift(function(a){return e.test(a)?(d.$setValidity("invalid",!0),a):void d.$setValidity("invalid",!1)}),b.bind("blur",function(){d.$viewValue&&(d.$viewValue=d.$viewValue.toLowerCase(),d.$render())})}}}),app.directive("checkPassword",function(){return{require:"ngModel",link:function(a,b,c,d){d.$parsers.unshift(function(a){return a.length>=1?(d.$setValidity("invalid",!0),a):void d.$setValidity("invalid",!1)})}}}),app.directive("checkPhone",function(){return{require:"ngModel",scope:{value:"=ngModel"},link:function(a,b,c,d){var e,f=/^[\s()+-]*([0-9][\s()+-]*){6,20}$/;d.$parsers.unshift(function(a){return f.test(a)?(d.$setValidity("invalid",!0),e=a):d.$setValidity("invalid",!1),e}),b.bind("blur",function(){var a=d.$viewValue;if(a){var b="3",c=3;a.length>c&&a.substr(0,1)===b&&(a=a.replace(/[^0-9]/g,""),a=[a.slice(0,c)," ",a.slice(c)].join(""),d.$viewValue=a,d.$render())}})}}}),app.directive("checkCfOrPiva",function(){return{require:"ngModel",scope:{value:"=ngModel"},link:function(a,b,c,d){var e=16,f=11;d.$parsers.unshift(function(a){var b,c,g,h,i,j=null;if(!a||a.length!==e&&a.length!==f)j="norCfNorPiva";else{if(a.length===e){for(a=a.toUpperCase(),c="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",g=0;16>g;g++)if(-1===c.indexOf(a.charAt(g))){j="cfinvalidchar";break}if(!j){var k="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",l="ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ",m="ABCDEFGHIJKLMNOPQRSTUVWXYZ",n="BAKPLCQDREVOSFTGUHMINJWZYX";for(i=0,g=1;13>=g;g+=2)i+=m.indexOf(l.charAt(k.indexOf(a.charAt(g))));for(g=0;14>=g;g+=2)i+=n.indexOf(l.charAt(k.indexOf(a.charAt(g))));i%26!==a.charCodeAt(15)-"A".charCodeAt(0)&&(j="cfcrcwrong")}}if(a.length===f){for(c="0123456789",g=0;11>g;g++)if(-1===c.indexOf(a.charAt(g))){j="pivainvalidchar";break}for(i=0,g=0;9>=g;g+=2)i+=a.charCodeAt(g)-"0".charCodeAt(0);for(g=1;9>=g;g+=2)h=2*(a.charCodeAt(g)-"0".charCodeAt(0)),h>9&&(h-=9),i+=h;(10-i%10)%10!==a.charCodeAt(10)-"0".charCodeAt(0)&&(j="pivacrcwrong")}}return j?d.$setValidity(j,!1):(d.$setValidity("norCfNorPiva",!0),d.$setValidity("cfinvalidchar",!0),d.$setValidity("cfcrcwrong",!0),d.$setValidity("pivainvalidchar",!0),d.$setValidity("pivacrcwrong",!0),b=a),b}),b.bind("blur",function(){d.$viewValue&&(d.$viewValue=d.$viewValue.toUpperCase(),d.$render())})}}});var KEYCODE_SHIFT=16,KEYCODE_ALT=18,KEYCODE_CTRL=11,KEYCODE_CAPSLOCK=20,KEYCODE_ENTER=13,KEYCODE_ESCAPE=27,KEYCODE_TAB=9,KEYCODE_BACKSPACE=8,KEYCODE_DELETE=46,KEYCODE_END=35,KEYCODE_FUNCTION_ARROW_LEFT=37,KEYCODE_FUNCTION_ARROW_UP=38,KEYCODE_FUNCTION_ARROW_RIGHT=39,KEYCODE_FUNCTION_ARROW_DOWN=40,KEYCODE_FUNCTION_PAGE_UP=33,KEYCODE_FUNCTION_PAGE_DOWN=34,KEYCODE_FUNCTION_KEY_F1=112,KEYCODE_FUNCTION_KEY_F2=113,KEYCODE_FUNCTION_KEY_F3=114,KEYCODE_FUNCTION_KEY_F4=115,KEYCODE_FUNCTION_KEY_F5=116,KEYCODE_FUNCTION_KEY_F6=117,KEYCODE_FUNCTION_KEY_F7=118,KEYCODE_FUNCTION_KEY_F8=119,KEYCODE_FUNCTION_KEY_F9=120,KEYCODE_FUNCTION_KEY_F10=121,KEYCODE_FUNCTION_KEY_F11=122,KEYCODE_FUNCTION_KEY_F12=123;app.directive("keyEnter",function(){return function(a,b,c){b.bind("keydown keypress",function(b){b.which===KEYCODE_ENTER&&(a.$apply(function(){a.$eval(c.keyEnter)}),b.preventDefault())})}}),app.directive("keyEscape",function(){return function(a,b,c){b.bind("keydown keypress",function(b){b.which===KEYCODE_ESCAPE&&(a.$apply(function(){a.$eval(c.keyEscape)}),b.preventDefault())})}}),app.directive("keyF1",function(){return function(a,b,c){b.bind("keydown keypress",function(b){b.which===KEYCODE_FUNCTION_KEY_F1&&(a.$apply(function(){a.$eval(c.keyF1)}),b.preventDefault())})}}),app.directive("spring",["$window",function(a){return{link:function(b,c,d){var e=$("body").find("#"+d.spring)[0],f=angular.element(a),g=0,h=3;"undefined"!=typeof e&&(g=h+e.clientHeight),b.getWindowHeight=function(){return{windowHeight:f.innerHeight(),topHeight:c[0].offsetTop,bottomHeight:g}},b.$watch(b.getWindowHeight,function(a){var b=a.windowHeight,d=a.topHeight,e=a.bottomHeight,f=b-(d+e);c.css({height:f})},!0),f.bind("resize",function(){b.$apply()})}}}]),app.directive("showDeviceClass",["$window",function(a){return{link:function(b,c){var d=angular.element(a);b.getWindowWidth=function(){return d.width()},b.$watch(b.getWindowWidth,function(a){var b=a,d="huge";1200>=b&&(d="wide"),992>=b&&(d="desktop"),768>=b&&(d="tablet"),480>=b&&(d="phone"),320>=b&&(d="custom"),c.html('<span style="color:darkgreen;font-style:italic;">width: '+b+"px&emsp;device: "+d+"</span>")},!0),d.bind("resize",function(){b.$apply()})}}}]),app.filter("hostnameFromUrl",function(){return function(a){var b=document.createElement("a");return b.href=a,b.hostname}}),app.filter("searchServiceReport",function(){return function(a,b,c){var d=[];if(a&&c){var e=new RegExp(".*"+c+".*","ig");for(var f in a){var g=a[f],h=a[f].customerId?b[a[f].customerId]:null;(e.test(g.dateIn)||e.test(g.notes)||h&&(e.test(h.name)||e.test(h.address)))&&d.push(a[f])}return d}return a}});