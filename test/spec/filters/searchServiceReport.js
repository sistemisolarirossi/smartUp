'use strict';

var mockdata = {
/* jshint quotmark: double */
  "servicereports" : {
    "-JVmoGIHMR6fpFtwZyjP" : {
      "customerId" : "-JVmo6wZM35ZQ_0K9tJu",
      "dateCreation" : "2014-09-01T20:03:56.289Z",
      "dateIn" : "2014-09-01T18:00:00.857Z",
      "dateOut" : "2014-09-01T18:00:00.857Z",
      "duration" : "2",
      "location" : "Via XX Settembre, 1, Turin, Italy",
      "notes" : "Installato nuovo firewall",
      "number" : 1,
      "operator" : "administrator"
    },
    "-JWnHZ_e7Y96DJ_bBYlZ" : {
      "customerId" : "-JVvXGe5xekK3n6Ahhu2",
      "dateCreation" : "2014-09-14T08:32:01.391Z",
      "dateIn" : "2014-09-14T11:31:49.303Z",
      "dateOut" : "2014-09-14T11:31:49.303Z",
      "duration" : "3",
      "location" : "Via Roma, Torino, TO, Italia",
      "notes" : "prova",
      "number" : 2,
      "operator" : "Administrator"
    },
    "-JY6Fz4I9-3Gg1dkiOy_" : {
      "customerId" : "-JVvXGe5xekK3n6Ahhu2",
      "dateCreation" : "2014-10-02T21:01:51.527Z",
      "dateIn" : "2014-09-29T19:47:00.000Z",
      "dateOut" : "2014-10-01T18:52:00.436Z",
      "duration" : "2",
      "location" : "Via Roma, Torino, TO, Italia",
      "notes" : "Trombate tutte le segretarie.",
      "number" : 203,
      "operator" : "Administrator"
    },
    "-J_1lxE3_CUx_xA5iM0n" : {
      "customerId" : "-JWhKafibuVF2f4p5_g0",
      "dateCreation" : "2014-10-24T15:30:42.176Z",
      "dateIn" : "2014-10-26T16:30:00.434Z",
      "dateOut" : "2014-10-24T17:30:00.434Z",
      "duration" : "2",
      "location" : "Strada della Carità, 77, Milano, MI, Italia",
      "number" : 221,
      "operator" : "Administrator"
    },
    "-J_32u33Gnosvd3vAFdw" : {
      "customerId" : "-JVvXGe5xekK3n6Ahhu2",
      "dateCreation" : "2014-10-24T21:28:35.413Z",
      "dateIn" : "2014-10-24T22:28:00.204Z",
      "dateOut" : "2014-10-24T22:28:00.204Z",
      "duration" : "1",
      "location" : "Via Roma, Torino, TO, Italia",
      "number" : 225,
      "operator" : "Administrator"
    },
    "-JY6Bln_VuG82fPNXcBv" : {
      "customerId" : "-JVvXGe5xekK3n6Ahhu2",
      "dateCreation" : "2014-09-30T15:34:48.112Z",
      "dateIn" : "2014-09-30T13:00:00.000Z",
      "dateOut" : "2014-09-30T18:32:00.464Z",
      "deleted" : true,
      "duration" : "3",
      "location" : "Via Roma, Torino, TO, Italia",
      "notes" : "Ricostruito lo studio.\nTrombata la dottoressa giovane.",
      "number" : 1,
      "operator" : "Administrator"
    },
  },
  "customers" : {
    "-JVmo6wZM35ZQ_0K9tJu" : {
      "address" : "Via XX Settembre, 1, TO, Italia",
      "cfpiva" : "12345678903",
      "dateCreation" : "2014-09-01T20:03:17.968Z",
      "email" : "info@gherarducci.com",
      "lastModify" : "2014-10-02T21:00:45.595Z",
      "name" : "Gherarducci",
      "phone" : "011 52423424"
    },
    "-JVvXGe5xekK3n6Ahhu2" : {
      "address" : "Via Roma, Torino, TO, Italia",
      "cfpiva" : "01234567897",
      "dateCreation" : "2014-09-03T12:41:54.136Z",
      "email" : "info@pontilli.com",
      "name" : "Pontilli",
      "phone" : "011 4444444"
    },
    "-JWhKafibuVF2f4p5_g0" : {
      "address" : "Strada della Carità, 77, Milano, MI, Italia",
      "cfpiva" : "01234567897",
      "dateCreation" : "2014-10-01T13:49:49.146Z",
      "email" : "info@martucci.com",
      "name" : "Martucci",
      "phone" : "333 33333123"
    },
    "-JXXhU1cM28dfjtV3bwZ" : {
      "address" : "Via Morgari 27, Trofarello, TO, Italia",
      "cfpiva" : "12345678903",
      "dateCreation" : "2014-09-23T13:31:47.235Z",
      "email" : "marcosolari@gmail.com",
      "lastModify" : "2014-10-22T08:13:21.628Z",
      "name" : "Francigli",
      "phone" : "011 423545345"
    },
  },
/* jshint quotmark: single */
};

describe('The searchServiceReport filter', function () {

  var $filter;

  beforeEach(function () {
    module('smartUpApp');

    inject(function (_$filter_) {
      $filter = _$filter_;
    });
  });

  beforeEach(angular.mock.inject(function($templateCache) {
    $templateCache.put('views/home.html', '<div>home</div>');
  }));

  it('should return service reports matching specified query string (note, existing, with regexp)', function () {
    expect($filter('searchServiceReport')
      (mockdata.servicereports, mockdata.customers, 'trombat[ae]')
      .length).toBe(2);
  });
  it('should return service reports matching specified query string (note, not existing)', function () {
    expect($filter('searchServiceReport')
      (mockdata.servicereports, mockdata.customers, 'baciate')
      .length).toBe(0);
  });
  it('should return service reports matching specified query string (customer name, existing)', function () {
    expect($filter('searchServiceReport')
      (mockdata.servicereports, mockdata.customers, 'Gherarducci')
      .length).toBe(1);
  });
  it('should return service reports matching specified query string (customer name, different case, existing)', function () {
    expect($filter('searchServiceReport')
      (mockdata.servicereports, mockdata.customers, 'gherarducci')
      .length).toBe(1);
  });
  it('should return service reports matching specified query string (customer name, not existing)', function () {
    expect($filter('searchServiceReport')
      (mockdata.servicereports, mockdata.customers, 'Gherarduccio')
      .length).toBe(0);
  });
  it('should return service reports matching specified query string (serviceReportId)', function () {
    expect($filter('searchServiceReport')
      (mockdata.servicereports, mockdata.customers, '-JVmoGIHMR6fpFtwZyjP')
      .length).toBe(0);
  });
  it('should return service reports matching specified query string (dateIn, existing)', function () {
    expect($filter('searchServiceReport')
      (mockdata.servicereports, mockdata.customers, '2014-10-24')
      .length).toBe(1);
  });
  it('should return service reports matching specified query string (address, existing, many)', function () {
    expect($filter('searchServiceReport')
      (mockdata.servicereports, mockdata.customers, 'via roma, torino')
      .length).toBe(4);
  });
  it('should return service reports matching specified query string (null)', function () {
    expect($filter('searchServiceReport')
      (mockdata.servicereports, mockdata.customers, null)
      .length).toBeUndefined();
  });
});
