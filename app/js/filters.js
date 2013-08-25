'use strict';

/* Filters */

angular.module('fitgressus.filters', []).
	filter('interpolate', ['version', function(version) {
		return function(text) {
			return String(text).replace(/\%VERSION\%/mg, version);
		}
	}]).
	filter('workoutTypeFilter', [function (input, workoutType) {
		return function (input, workoutType) {
			if(!workoutType) return input;
			var res = {};	// exercises are collected in an object

			angular.forEach(input, function (exercise, id) {
				if(exercise.group == workoutType)
					res[id] = exercise;
			});

			return res;
		};
	}]);
