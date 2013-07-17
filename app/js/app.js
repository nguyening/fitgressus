'use strict';


// Declare app level module which depends on filters, and services
angular.module('fitgressus', ['ngCookies', 'fitgressus.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/index', {templateUrl: 'partials/tracker.html', controller: 'TrackerCtrl'});
    $routeProvider.otherwise({redirectTo: '/index'});
  }]);
