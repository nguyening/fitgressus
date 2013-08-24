'use strict';

/* Controllers */
angular.module('fitgressus.controllers', []).
	controller('StartWorkoutCtrl', ['$scope', '$http', 'workoutState', function($scope, $http, workoutState) {
		workoutState.verifyPage('/index');

		$scope.date = new Date().toJSON().slice(0, 10);   //default date to today
		$scope.previousWorkouts = workoutState.getPrevWorkouts();
		
		$scope.beginWorkout = function () {
			workoutState.initializeWorkout($scope.date);
			workoutState.transferPage({
				startTime	:	new Date().getTime() / 1000,
			}, '/workout');
		};

		$scope.removeWorkout = function (workoutIdx) {
			$scope.previousWorkouts.splice(workoutIdx, 1);
			workoutState.updatePrevWorkouts($scope.previousWorkouts);
		};

		$scope.reviewWorkout = function (workoutIdx) {
			workoutState.transferPage(null, '/review/'+workoutIdx);
		};

		// $scope.addDummyData = function () {
		// 	$http.get('data/previousWorkouts.json').success(function (data) {
		// 		$scope.previousWorkouts = data;
		// 		webStorage.add('workouts', JSON.stringify(data), Infinity);
		// 	});
		// };

	}]).
	controller('WorkoutCtrl', ['$scope', '$http', 'workoutState', function($scope, $http, workoutState) {
		workoutState.verifyPage('/workout');
		$scope.selectedWorkoutType = workoutState.get('selectedWorkoutType') || 0;
		

		$scope.startExercise = function (exerciseName) {
			workoutState.transferPage({
				selectedWorkoutType	:	$scope.selectedWorkoutType,
				currentExercise	:	exerciseName,
			}, '/exercise');
		};

		$scope.finishWorkout = function () {
			workoutState.transferPage(null, '/finish')
		};

		$http.get('data/workouts.json').success(function (data) {
			$scope.workoutTypes = data;
		});
	}]).
	controller('ExerciseCtrl', ['$scope', 'workoutState', function($scope, workoutState) {
		workoutState.verifyPage('/exercise');

		$scope.currentExercise = {
			name : workoutState.get('currentExercise'),
			reps : 7,
			wt: 0,
			sets: 0
		  };

		$scope.droppedExercises = [];

		$scope.cancelExercise = function () {
			workoutState.transferPage(null, '/workout');
		};

		$scope.addExercise = function () {
			if($scope.currentExercise.sets)
				$scope.droppedExercises.push(angular.copy($scope.currentExercise));

			workoutState.addExercises($scope.droppedExercises);
			workoutState.transferPage(null, '/workout');
		};

		$scope.dropWeight = function () {
			$scope.droppedExercises.push(angular.copy($scope.currentExercise));
			$scope.currentExercise.wt = 0;
			$scope.currentExercise.sets = 0;
		};
	}]).
	controller('EndCtrl', ['$scope', 'workoutState', function($scope, workoutState) {
		workoutState.verifyPage('/finish');

		var workoutTimeSecs = ((new Date().getTime() / 1000) - workoutState.get('startTime'));
		var hours = parseInt(workoutTimeSecs / 3600) % 24;
		var minutes = parseInt(workoutTimeSecs / 60) % 60;
		var seconds = Math.round(workoutTimeSecs % 60);

		$scope.duration = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
		
		var workout = workoutState.get('workout');
		$scope.exercises = workout.exercises;

		$scope.removeExercise = function (exerciseIdx) {
			$scope.exercises.splice(exerciseIdx, 1);
		};

		$scope.done = function () {
			workout.duration = $scope.duration;
			workoutState.addWorkout(workout);
			workoutState.transferPage(null, '/index');
		};
	}]).
	controller('ReviewWorkoutCtrl', ['$scope', '$routeParams', 'workoutState', function ($scope, $routeParams, workoutState) {
		var workouts = workoutState.getPrevWorkouts();
		var idx = $routeParams.idx;
		if(workouts.length <= idx)
			$location.path('/index');
		
		$scope.workout = workouts[idx];
	}]).
	controller('ProgressCtrl', ['$scope', 'webStorage', function ($scope, webStorage) {
		$scope.previousWorkouts = JSON.parse(webStorage.get('workouts'));
		

	}]);