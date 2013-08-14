'use strict';

/* Controllers */
angular.module('fitgressus.controllers', []).
	controller('StartWorkoutCtrl', ['$scope', '$location', 'webStorage', '$http', function($scope, $location, webStorage, $http) {
		/* START_STATE */
		var lastPhase = webStorage.get('ls_lastPhase');
		if(lastPhase != '/index')
			$location.path(lastPhase);
		else 
			webStorage.add('ls_lastPhase', '/index');
		/* END_STATE */

		$scope.date = new Date().toJSON().slice(0, 10);   //default date to today
		$scope.previousWorkouts = JSON.parse(webStorage.get('workouts'));
		
		$scope.beginWorkout = function () {
			webStorage.add('ls_workout', JSON.stringify({  
				date: $scope.date,
				exercises: []
			}));

			webStorage.add('ls_startTime', new Date().getTime() / 1000);
			webStorage.add('ls_lastPhase', '/workout');
			$location.path('/workout');
		};

		$scope.removeWorkout = function (workoutIdx) {
			$scope.previousWorkouts.splice(workoutIdx, 1);
			webStorage.add('workouts', JSON.stringify($scope.previousWorkouts), Infinity);
		};

		$scope.reviewWorkout = function (workoutIdx) {
			$location.path('/review/'+workoutIdx);
		};

		// $scope.addDummyData = function () {
		// 	$http.get('data/previousWorkouts.json').success(function (data) {
		// 		$scope.previousWorkouts = data;
		// 		webStorage.add('workouts', JSON.stringify(data), Infinity);
		// 	});
		// };

	}]).
	controller('WorkoutCtrl', ['$scope', '$location', '$http', 'webStorage', function($scope, $location, $http, webStorage) {
		/* START_STATE */
		if(webStorage.get('ls_lastPhase') != '/workout') {
			$location.path('/index');
		}
		var last_sWT = webStorage.get('ls_selectedWorkoutType');
		if(last_sWT)
			$scope.selectedWorkoutType = last_sWT;
		/* END_STATE */

		$scope.startExercise = function (exerciseName) {
			webStorage.add('ls_selectedWorkoutType', $scope.selectedWorkoutType);
			webStorage.add('ls_currentExercise', exerciseName);

			webStorage.add('ls_lastPhase', '/exercise');
			$location.path('/exercise');  
		};

		$scope.finishWorkout = function () {
			webStorage.add('ls_lastPhase', '/finish');
			$location.path('/finish');	
		};

		$http.get('data/workouts.json').success(function (data) {
			$scope.workoutTypes = data;
			if($scope.selectedWorkoutType == undefined)
				$scope.selectedWorkoutType = 0;
		});
	}]).
	controller('ExerciseCtrl', ['$scope', '$location', 'webStorage', function($scope, $location, webStorage) {
		/* START_STATE */
		if(webStorage.get('ls_lastPhase') != '/exercise') {
			$location.path('/index');
		}
		/* END_STATE */

		$scope.currentExercise = {
			name : webStorage.get('ls_currentExercise'),
			reps : 7,
			wt: 0,
			sets: 0
		  };

		$scope.droppedExercises = [];

		var cloneObject = function (obj) {
			var clone ={};
			for( var key in obj ){
				if(obj.hasOwnProperty(key)) //ensure not adding inherited props
					clone[key]=obj[key];
			}
			return clone;
		};

		$scope.cancelExercise = function () {
			webStorage.add('ls_lastPhase', '/workout');
			$location.path('/workout');
		};

		$scope.addExercise = function () {
			if($scope.currentExercise.sets)
				$scope.droppedExercises.push(cloneObject($scope.currentExercise));

			var workout = JSON.parse(webStorage.get('ls_workout'));
			workout.exercises = workout.exercises.concat($scope.droppedExercises);
			webStorage.add('ls_workout', JSON.stringify(workout));

			webStorage.add('ls_lastPhase', '/workout');
			$location.path('/workout');
		};

		$scope.dropWeight = function () {
			$scope.droppedExercises.push(cloneObject($scope.currentExercise));
			$scope.currentExercise.wt = 0;
			$scope.currentExercise.sets = 0;
		};
	}]).
	controller('EndCtrl', ['$scope', '$location', 'webStorage', function($scope, $location, webStorage) {
		/* START_STATE */
		if(webStorage.get('ls_lastPhase') != '/finish') {
			$location.path('/index');
		}
		/* END_STATE */

		var workoutTimeSecs = ((new Date().getTime() / 1000) - webStorage.get('ls_startTime'));
		var hours = parseInt(workoutTimeSecs / 3600) % 24;
		var minutes = parseInt(workoutTimeSecs / 60) % 60;
		var seconds = Math.round(workoutTimeSecs % 60);

		$scope.duration = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
		
		var workout = JSON.parse(webStorage.get('ls_workout'));
		$scope.exercises = workout.exercises;

		$scope.removeExercise = function (exerciseIdx) {
			$scope.exercises.splice(exerciseIdx, 1);
		};

		$scope.done = function () {
			workout.duration = $scope.duration;

			var workouts = JSON.parse(webStorage.get('workouts')) || [];
			workouts.unshift(workout);
			webStorage.add('workouts', JSON.stringify(workouts), Infinity);

			webStorage.add('ls_lastPhase', '/index');
			$location.path('/index');
		};
	}]).
	controller('ReviewWorkoutCtrl', ['$scope', '$routeParams', 'webStorage', '$location', function ($scope, $routeParams, webStorage, $location) {
		var workouts = JSON.parse(webStorage.get('workouts'));
		var idx = $routeParams.idx;
		if(workouts.length <= idx)
			$location.path('/index');
		
		$scope.workout = workouts[idx];
	}]).
	controller('ProgressCtrl', ['$scope', 'webStorage', function ($scope, webStorage) {
		$scope.previousWorkouts = JSON.parse(webStorage.get('workouts'));
		

	}]);