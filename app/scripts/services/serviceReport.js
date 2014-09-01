'use strict';
     
app.factory('Servicereport', function ($firebase, CFG, User) {
  // N.B.: User injection is necessary to mantain current user across hard page loads...
  var ref = new Firebase(CFG.FIREBASE_URL + 'servicereports');
  var servicereports = $firebase(ref);

  var Servicereport = {
    all: servicereports,
    create: function (servicereport) {
      if (User.signedIn()) {
        var user = User.getCurrent();

        servicereport.operator = user.username;
        
        return servicereports.$add(servicereport).then(function (ref) {
          var servicereportId = ref.name(); 
          user.$child('servicereports').$child(servicereportId).$set(true);
          return servicereportId;
        });
      }
    },
    set: function(servicereportId, servicereport) {
      return servicereports.$child(servicereportId).$set(servicereport);
    },
    find: function (servicereportId) {
      return servicereports.$child(servicereportId);
    },
    getNumberNext: function () {
      var n = servicereports.$child('stash').serviceReportNumber;
      n = n ? n : 1;
      //console.info('getNumberNext() - serviceReportNumber is now', n);
      return n;
    },
    setNumberNext: function () {
      var n = servicereports.$child('stash').serviceReportNumber;
      n = n ? n + 1 : 1;
      //console.info('setNumberNext() - serviceReportNumber will be', n);
      servicereports.$child('stash').$set({ 'serviceReportNumber': n });
      return n;
    },
    resetNumberNext: function () {
      var n = servicereports.$child('stash').serviceReportNumber;
      n = n && n > 1 ? n - 1 : 1;
      servicereports.$child('stash').$set({ 'serviceReportNumber': n });
      return n;
    },
    /*
    setAttribute: function (servicereportId, attributeValue) {
      if (User.signedIn()) {
        ref.child(servicereportId).attribute.set(attributeValue);
      }
    },
    */
    delete: function (servicereportId) {
      if (User.signedIn()) {
        console.info('DELETE', servicereportId);
        var servicereport = Servicereport.find(servicereportId);
        servicereport.$on('loaded', function () {
          console.info('set delete to true servicereport with id:', servicereportId);
          var servicereport = Servicereport.find(servicereportId);
          servicereport.deleted = true;
          servicereport.$on('loaded', function () {
            servicereports.$child(servicereportId).$set(servicereport);
          });
          /*
          var user = User.findByUsername(servicereport.operator);
          servicereports.$remove(servicereportId).then(function () {
            console.info('removed', servicereportId);
            if (user) {
              user.$child('servicereports').$remove(servicereportId);
            }
          });
          */
        });
      }
    },
  };
 
  return Servicereport;
});