'use strict';


// Declare app level module which depends on filters, and services
angular.module('fitgressus', ['fitgressus.controllers', 'fitgressus.directives', 'fitgressus.services', 'fitgressus.filters']).
	config(['$routeProvider', function($routeProvider) {
		$routeProvider.when('/index', {templateUrl: 'partials/_startWorkout.html', controller: 'StartWorkoutCtrl', resolve: {
			'exerciseServiceData': ['exerciseService', function (exerciseService) {
				return exerciseService.promise;
			}]
		}});
		$routeProvider.when('/workout', {templateUrl: 'partials/_workout.html', controller: 'WorkoutCtrl', resolve: {
			'exerciseServiceData': ['exerciseService', function (exerciseService) {
				return exerciseService.promise;
			}]
		}});
		$routeProvider.when('/exercise', {templateUrl: 'partials/_exercise.html', controller: 'ExerciseCtrl', resolve: {
			'exerciseServiceData': ['exerciseService', function (exerciseService) {
				return exerciseService.promise;
			}]
		}});
		$routeProvider.when('/finish', {templateUrl: 'partials/_end.html', controller: 'EndCtrl', resolve: {
			'exerciseServiceData': ['exerciseService', function (exerciseService) {
				return exerciseService.promise;
			}]
		}});
		$routeProvider.when('/review/:idx', {templateUrl: 'partials/_reviewWorkout.html', controller: 'ReviewWorkoutCtrl', resolve: {
			'exerciseServiceData': ['exerciseService', function (exerciseService) {
				return exerciseService.promise;
			}]
		}});
		$routeProvider.when('/progress', {templateUrl: 'partials/_progress.html', controller: 'ProgressCtrl', resolve: {
			'exerciseServiceData': ['exerciseService', function (exerciseService) {
				return exerciseService.promise;
			}]
		}});
		$routeProvider.otherwise({redirectTo: '/index'});
	}]).
	run(['$rootScope', 'backwardsDataService', function ($rootScope, backwardsDataService) {
		backwardsDataService.run();

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