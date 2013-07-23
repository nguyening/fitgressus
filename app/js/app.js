'use strict';


// Declare app level module which depends on filters, and services
angular.module('fitgressus', ['ngCookies', 'fitgressus.controllers']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/index', {templateUrl: 'partials/_startWorkout.html', controller: 'StartWorkoutCtrl'});
    $routeProvider.when('/workout', {templateUrl: 'partials/_workout.html', controller: 'WorkoutCtrl'});
    $routeProvider.when('/exercise', {templateUrl: 'partials/_exercise.html', controller: 'ExerciseCtrl'});
    $routeProvider.when('/finish', {templateUrl: 'partials/_end.html', controller: 'EndCtrl'});
    $routeProvider.when('/review/:idx', {templateUrl: 'partials/_reviewWorkout.html', controller: 'ReviewWorkoutCtrl'});
    $routeProvider.otherwise({redirectTo: '/index'});
  }]);
