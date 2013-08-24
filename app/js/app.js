'use strict';


// Declare app level module which depends on filters, and services
angular.module('fitgressus', ['fitgressus.controllers', 'fitgressus.directives', 'fitgressus.services']).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/index', {templateUrl: 'partials/_startWorkout.html', controller: 'StartWorkoutCtrl'});
		$routeProvider.when('/workout', {templateUrl: 'partials/_workout.html', controller: 'WorkoutCtrl', resolve: {
			'exerciseServiceData': ['exerciseService', function (exerciseService) {
				return exerciseService.promise;
			}]
		}});
		$routeProvider.when('/exercise', {templateUrl: 'partials/_exercise.html', controller: 'ExerciseCtrl'});
		$routeProvider.when('/finish', {templateUrl: 'partials/_end.html', controller: 'EndCtrl'});
		$routeProvider.when('/review/:idx', {templateUrl: 'partials/_reviewWorkout.html', controller: 'ReviewWorkoutCtrl'});
		$routeProvider.when('/progress', {templateUrl: 'partials/_progress.html', controller: 'ProgressCtrl'});
		$routeProvider.otherwise({redirectTo: '/index'});
	}]).
	run(['$rootScope', '$http', function ($rootScope, $http) {
		$rootScope.groups = [
			{
				key	:	"abso",
				label : "Abs",
			},
			{
				key	:	"bkbi",
				label : "Back & Bis",
			},
			{
				key	:	"shld",
				label : "Shoulders",
			},
			{
				key	:	"chtr",
				label : "Chest & Tris",
			},
			{
				key	:	"legs",
				label : "Legs",
			},
		];


	}]);