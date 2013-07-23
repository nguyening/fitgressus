'use strict';

/* Controllers */

angular.module('fitgressus.controllers', []).
	controller('StartWorkoutCtrl', ['$scope', '$location', '$rootScope', '$cookieStore', function($scope, $location, $rootScope, $cookieStore) {
		$scope.date = new Date().toJSON().slice(0, 10);   //default date to today
		$scope.previousWorkouts = $cookieStore.get('workouts');
		$scope.beginWorkout = function () {
			$rootScope.workout = {  // TODO: turn into service
				date: $scope.date,
				exercises: []
			  };

			$rootScope.startTime = new Date().getTime() / 1000;

			$location.path('/workout');
		};

		$scope.removeWorkout = function (workoutIdx) {
			$scope.previousWorkouts.splice(workoutIdx, 1);
			$cookieStore.put('workouts', $scope.previousWorkouts);
		};

		$scope.reviewWorkout = function (workoutIdx) {
			$location.path('/review/'+workoutIdx);
		};

	}]).
	controller('WorkoutCtrl', ['$scope', '$location', '$http', '$rootScope', function($scope, $location, $http, $rootScope) {
		if($rootScope.workout == undefined)
			$location.path('/index');

		$scope.startExercise = function (exerciseName) {
			$rootScope.selectedWorkoutType = $scope.selectedWorkoutType;
			console.log($rootScope.selectedWorkoutType);
			$rootScope.currentExercise = exerciseName;
			$location.path('/exercise');  
		};

		$scope.finishWorkout = function () {
			$location.path('/finish');	
		};

		$http.get('data/workouts.json').success(function (data) {
			$scope.workoutTypes = data;
			if($rootScope.selectedWorkoutType != undefined)
				$scope.selectedWorkoutType = $rootScope.selectedWorkoutType;
			else
				$scope.selectedWorkoutType = 0;
		});
	}]).
	controller('ExerciseCtrl', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope) {
		if($rootScope.workout == undefined || $rootScope.currentExercise == undefined)
			$location.path('/index');

		$scope.currentExercise = {
			name : $rootScope.currentExercise,
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
			$rootScope.currentExercise = null;
			$location.path('/workout');
		};

		$scope.addExercise = function () {
			if($scope.currentExercise.sets)
				$scope.droppedExercises.push(cloneObject($scope.currentExercise));

			$rootScope.workout.exercises = $rootScope.workout.exercises.concat($scope.droppedExercises);
			$rootScope.currentExercise = null;
			$location.path('/workout');
		};

		$scope.dropWeight = function () {
			$scope.droppedExercises.push(cloneObject($scope.currentExercise));
			$scope.currentExercise.wt = 0;
			$scope.currentExercise.sets = 0;
		};
	}]).
	controller('EndCtrl', ['$scope', '$location', '$rootScope', '$cookieStore', function($scope, $location, $rootScope, $cookieStore) {
		if($rootScope.workout == undefined)
			$location.path('/index');

		var workoutTimeSecs = ((new Date().getTime() / 1000) - $rootScope.startTime);
		var hours = parseInt(workoutTimeSecs / 3600) % 24;
		var minutes = parseInt(workoutTimeSecs / 60) % 60;
		var seconds = Math.round(workoutTimeSecs % 60);

		$scope.duration = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
		$scope.exercises = $rootScope.workout.exercises;

		$scope.removeExercise = function (exerciseIdx) {
			$scope.exercises.splice(exerciseIdx, 1);
		};

		$scope.done = function () {
			$rootScope.workout.duration = $scope.duration;

			var workouts = $cookieStore.get('workouts') || [];
			workouts.unshift($rootScope.workout);
			$cookieStore.put('workouts', workouts);
			console.log($cookieStore.get('workouts'));
			$location.path('/index');
		};
	}]).
	controller('ReviewWorkoutCtrl', ['$scope', '$routeParams', '$cookieStore', '$location', function ($scope, $routeParams, $cookieStore, $location) {
		var workouts = $cookieStore.get('workouts');
		var idx = $routeParams.idx;
		if(workouts.length <= idx)
			$location.path('/index');
		
		$scope.workout = workouts[idx];
	}]);