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
	}]).
	controller('WorkoutCtrl', ['$scope', '$rootScope', 'workoutStateService', 'exerciseService', function($scope, $rootScope, workoutStateService, exerciseService) {
		workoutStateService.verifyPage('/workout');

		$scope.exercises = exerciseService.getExercises();
		$scope.groups = $rootScope.groups;
		$scope.selectedMuscleGroup = workoutStateService.get('selectedMuscleGroup') || $scope.groups[0].key;

		$scope.startExercise = function (exerciseId) {
			workoutStateService.transferPage({
				selectedMuscleGroup	:	$scope.selectedMuscleGroup,
				currentExerciseId	:	exerciseId,
			}, '/exercise');
		};

		$scope.finishWorkout = function () {
			workoutStateService.transferPage(null, '/finish')
		};
	}]).
	controller('ExerciseCtrl', ['$scope', 'workoutStateService', 'exerciseService', function($scope, workoutStateService, exerciseService) {
		workoutStateService.verifyPage('/exercise');

		$scope.exercises = exerciseService.getExercises();
		$scope.completedExercises = [];
		
		$scope.exerciseId = workoutStateService.get('currentExerciseId') || -1;

		$scope.exerciseModel = jQuery.noConflict().extend(true, {	// have to use jQ for deep (recursive) extending..
			label : "New Exercise",
			type :  "other",
			group : workoutStateService.get('selectedMuscleGroup') || "none",
			options : {
				wt : 0,
				reps : 7,
				calculate_wt : "wt",
			},
		}, angular.copy($scope.exercises[$scope.exerciseId]));

		$scope.resetExercise = function () {
			$scope.currentExercise = {
				wt : $scope.exerciseModel.options.wt,
				reps : $scope.exerciseModel.options.reps,
				sets : 0,
			};
		};
		$scope.resetExercise();	// call immediately at beginning

		$scope.cancelExercise = function () {
			workoutStateService.transferPage({
				currentExerciseId : -1,
			}, '/workout');
		};

		$scope.finishExercise = function () {
			if($scope.currentExercise.sets)
				$scope.completedExercises.push(angular.copy($scope.currentExercise));

			workoutStateService.addExercises($scope.exerciseId, $scope.completedExercises, $scope.exerciseModel);
			workoutStateService.transferPage(null, '/workout');
		};

		$scope.changeWeight = function () {
			if($scope.currentExercise.sets)
				$scope.completedExercises.push(angular.copy($scope.currentExercise));

			$scope.resetExercise();
		};

		$scope.removeExercise = function (exerciseIdx) {
			$scope.droppedExercises.splice(exerciseIdx, 1);
		};
	}]).
	controller('EndCtrl', ['$scope', 'workoutStateService', 'exerciseService', function($scope, workoutStateService, exerciseService) {
		workoutStateService.verifyPage('/finish');

		var workoutTimeSecs = ((new Date().getTime() / 1000) - workoutStateService.get('startTime'));
		var hours = parseInt(workoutTimeSecs / 3600) % 24;
		var minutes = parseInt(workoutTimeSecs / 60) % 60;
		var seconds = Math.round(workoutTimeSecs % 60);

		$scope.duration = (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds  < 10 ? "0" + seconds : seconds);
		
		var workout = workoutStateService.get('workout');
		$scope.completedExercises = workout.exercises;
		$scope.exercises = exerciseService.getExercises();

		$scope.done = function () {
			workout.duration = $scope.duration;
			workoutStateService.addWorkout(workout);
			workoutStateService.transferPage(null, '/index');
		};
	}]).
	controller('ReviewWorkoutCtrl', ['$scope', '$routeParams', 'workoutStateService', 'exerciseService', function ($scope, $routeParams, workoutStateService, exerciseService) {
		var workouts = workoutStateService.getPrevWorkouts();
		var idx = $routeParams.idx;
		if(workouts.length <= idx)
			workoutStateService.transferPage(null, '/index');
		else {
			$scope.workout = workouts[idx];
			$scope.completedExercises = $scope.workout.exercises;
			$scope.exercises = exerciseService.getExercises();

			angular.forEach($scope.completedExercises, function (exercise) {
				var setGroups = exercise.setGroups;
				var calculateWt = ($scope.exercises[exercise.exerciseId].options || { calculate_wt: "wt" }).calculate_wt || "wt";
				calculateWt = calculateWt.replace(/wt/gi, 'exercise.wt');

				var totalWt = setGroups.reduce(function (totalWt, exercise) {
						return totalWt + (exercise.sets * exercise.reps * eval(calculateWt));
					}, 0);

				var totalReps = setGroups.reduce(function (totalReps, exercise) {
						return totalReps + (exercise.sets * exercise.reps);
					}, 0);

				exercise.stats = {
					totalWt : totalWt,
					totalReps : totalReps,
					avgWtPerRep :  (totalWt / totalReps).toFixed(1),
					calculateWt : calculateWt,
				};
			});

			$scope.totalWtMoved = $scope.completedExercises.reduce(function (totalWtMoved, exercise) {
				return totalWtMoved + exercise.stats.totalWt;
			}, 0);
		}
	}]).
	controller('ProgressCtrl', ['$scope', 'workoutStateService', 'exerciseService', function ($scope, workoutStateService, exerciseService) {
		$scope.exercises = exerciseService.getExercises();
		$scope.previousWorkouts = workoutStateService.getPrevWorkouts();
		
	}]);