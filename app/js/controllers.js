'use strict';

/* Controllers */

angular.module('fitgressus.controllers', []).
  controller('TrackerCtrl', ['$scope', '$cookieStore', '$http', function($scope, $cookieStore, $http) {
  	$scope.user = {
  		name: $cookieStore.get('username') || 'User',
  		lastCheckIn: $cookieStore.get('workouts') ? $cookieStore.get('workouts')[0].date : 'never'
  	};

  	$scope.workoutTypes = [{
  			label: 'Freestyle',
  			exercises: ['Abs']
  		}];
  	$scope.selectedWorkoutType = $scope.workoutTypes[0];
  	$scope.workout = {
  		date: new Date().toJSON().slice(0, 10),		//default date to today
  		exercises: []
  	};

    $scope.currentExercise = null;

    $scope.newExercise = function (exerciseName) {
        $scope.currentExercise = {
            name: exerciseName,
            sets: 0,
            reps: 7,
            wt: 0
        };
    };

    $scope.cancelExercise = function () {
        $scope.currentExercise = null;
    }

    function cloneObject (obj) {
        var clone ={};
        for( var key in obj ){
            if(obj.hasOwnProperty(key)) //ensure not adding inherited props
                clone[key]=obj[key];
        }
        return clone;
    }

  	$scope.addExercise = function () {
  		$scope.workout.exercises.push(cloneObject($scope.currentExercise));
    };

    $scope.dropWeight = function () {
        if($scope.currentExercise.sets)
            $scope.workout.exercises.push(cloneObject($scope.currentExercise));
        $scope.currentExercise.wt = 0;
        $scope.currentExercise.sets = 0;
    }

  	$scope.removeExercise = function (idx) {
  		$scope.workout.exercises.splice(idx, 1);
  	}

  	$scope.saveWorkout = function () {
  		var workouts = $cookieStore.get('workouts') || [];
  		workouts.unshift($scope.workout);
  		$cookieStore.put('workouts', workouts);
  		console.log($cookieStore.get('workouts'));
  	};

  	$scope.emptyWorkouts = function () {
  		$cookieStore.remove('workouts');
  	}

  	$http.get('data/workouts.json').success(function (data) {
  		$scope.workoutTypes = $scope.workoutTypes.concat(data);
  	});

  }]);