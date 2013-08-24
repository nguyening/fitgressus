'use strict';

/* Controllers */
angular.module('fitgressus.controllers', []).
	controller('StartWorkoutCtrl', ['$scope', 'workoutStateService', function($scope, workoutStateService) {
		workoutStateService.verifyPage('/index');

		$scope.date = new Date().toJSON().slice(0, 10);   //default date to today
		$scope.previousWorkouts = workoutStateService.getPrevWorkouts();
		
		$scope.beginWorkout = function () {
			workoutStateService.initializeWorkout($scope.date);
			workoutStateService.transferPage({
				startTime	:	new Date().getTime() / 1000,
			}, '/workout');
		};

		$scope.removeWorkout = function (workoutIdx) {
			$scope.previousWorkouts.splice(workoutIdx, 1);
			workoutStateService.updatePrevWorkouts($scope.previousWorkouts);
		};

		$scope.reviewWorkout = function (workoutIdx) {
			workoutStateService.transferPage(null, '/review/'+workoutIdx);
		};

		// $scope.addDummyData = function () {
		// 	$http.get('data/previousWorkouts.json').success(function (data) {
		// 		$scope.previousWorkouts = data;
		// 		webStorage.add('workouts', JSON.stringify(data), Infinity);
		// 	});
		// };

	}]).
	controller('WorkoutCtrl', ['$scope', 'workoutStateService', 'exerciseService', function($scope, workoutStateService, exerciseService) {
		workoutStateService.verifyPage('/workout');
		$scope.workoutTypes = exerciseService.getExercises();
		$scope.selectedWorkoutType = workoutStateService.get('selectedWorkoutType') || 0;

		$scope.startExercise = function (exerciseName) {
			workoutStateService.transferPage({
				selectedWorkoutType	:	$scope.selectedWorkoutType,
				currentExercise	:	exerciseName,
			}, '/exercise');
		};

		$scope.finishWorkout = function () {
			workoutStateService.transferPage(null, '/finish')
		};
	}]).
	controller('ExerciseCtrl', ['$scope', 'workoutStateService', function($scope, workoutStateService) {
		workoutStateService.verifyPage('/exercise');

		$scope.currentExercise = {
			name : workoutStateService.get('currentExercise'),
			reps : 7,
			wt: 0,
			sets: 0
		  };

		$scope.droppedExercises = [];

		$scope.cancelExercise = function () {
			workoutStateService.transferPage(null, '/workout');
		};

		$scope.addExercise = function () {
			if($scope.currentExercise.sets)
				$scope.droppedExercises.push(angular.copy($scope.currentExercise));

			workoutStateService.addExercises($scope.droppedExercises);
			workoutStateService.transferPage(null, '/workout');
		};

		$scope.dropWeight = function () {
			$scope.droppedExercises.push(angular.copy($scope.currentExercise));
			$scope.currentExercise.wt = 0;
			$scope.currentExercise.sets = 0;
		};

		$scope.removeExercise = function (exerciseIdx) {
			$scope.droppedExercises.splice(exerciseIdx, 1);
		};
	}]).
	controller('EndCtrl', ['$scope', 'workoutStateService', function($scope, workoutStateService) {
		workoutStateService.verifyPage('/finish');

		var workoutTimeSecs = ((new Date().getTime() / 1000) - workoutStateService.get('startTime'));
		var hours = parseInt(workoutTimeSecs / 3600) % 24;
		var minutes = parseInt(workoutTimeSecs / 60) % 60;
		var seconds = Math.round(workoutTimeSecs % 60);

		$scope.duration = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
		
		var workout = workoutStateService.get('workout');
		$scope.exercises = workout.exercises;

		$scope.removeExercise = function (exerciseIdx) {
			$scope.exercises.splice(exerciseIdx, 1);
		};

		$scope.done = function () {
			workout.duration = $scope.duration;
			workoutStateService.addWorkout(workout);
			workoutStateService.transferPage(null, '/index');
		};
	}]).
	controller('ReviewWorkoutCtrl', ['$scope', '$routeParams', 'workoutStateService', function ($scope, $routeParams, workoutStateService) {
		var workouts = workoutStateService.getPrevWorkouts();
		var idx = $routeParams.idx;
		if(workouts.length <= idx)
			$location.path('/index');
		
		$scope.workout = workouts[idx];
	}]);//.
	// controller('ProgressCtrl', ['$scope', 'webStorage', function ($scope, webStorage) {
	// 	$scope.previousWorkouts = JSON.parse(webStorage.get('workouts'));
		

	// }]);