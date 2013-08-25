
'use strict';

/* Services */
angular.module('fitgressus.services', ['webStorageModule']).
	value('version', '0.7').
	// for data in browser that may not be format-compatible with this version of the app
	factory('backwardsDataService', ['webStorage', 'version', function (webStorage, version) {
		return {
			run : function () {
				var dataVersion = webStorage.get('version') || "0.0";
				var workouts = webStorage.get('workouts') || "";
				if(dataVersion != version)
					webStorage.add('old_data_v'+dataVersion, workouts);
			},
		};
	}]).
	factory('workoutStateService', ['webStorage', '$location', function (webStorage, $location) {
		// when service is instantiated, pull from web storage
		var	globalState = {
				lastPhase : webStorage.get('ls_lastPhase'),
				currentExerciseId : webStorage.get('ls_currentExerciseId') || -1,
				selectedMuscleGroup : webStorage.get('ls_selectedMuscleGroup'),
				startTime : webStorage.get('ls_startTime'),
				workout : JSON.parse(webStorage.get('ls_workout') || "{}"),
			};

		return {
			_redirect : function (route) {
				$location.path(route);
			},
			get : function (attr) {
				return globalState[attr];
			},
			verifyPage : function (currentPage, callback) {
				if(typeof globalState.lastPhase == 'undefined' || 
					!globalState.lastPhase) {

					webStorage.add('ls_lastPhase', '/index');
					this._redirect('/index');
				}
				else if(globalState.lastPhase != currentPage && globalState.lastPhase.indexOf('review') == -1) {
					this._redirect(globalState.lastPhase);	
				}
				// else do nothing, we're on the right page

				if(callback instanceof Function) { return callback(); }
			},
			transferPage : function (passedState, lastPhase, callback) {
				var state = angular.extend({
					currentExerciseId	:	globalState.currentExerciseId,
					selectedMuscleGroup	:	globalState.selectedMuscleGroup,
					startTime	:	globalState.startTime,
				}, passedState);

				// back up to webStorage in case the user refreshes/crashes
				webStorage.add('ls_lastPhase', lastPhase);
				webStorage.add('ls_currentExerciseId', state.currentExerciseId);
				webStorage.add('ls_selectedMuscleGroup', state.selectedMuscleGroup);
				webStorage.add('ls_startTime', state.startTime);

				globalState.lastPhase =  lastPhase;
				globalState.currentExerciseId =  state.currentExerciseId;
				globalState.selectedMuscleGroup =  state.selectedMuscleGroup;
				globalState.startTime =  state.startTime;

				this._redirect(globalState.lastPhase);

				if(callback instanceof Function) { return callback(); }
			},

			// Specific/hacky functions
			initializeWorkout : function (dt) {
				globalState.workout = {  
					date: dt,
					exercises: []
				};
				webStorage.add('ls_workout', JSON.stringify(globalState.workout));
			},

			getPrevWorkouts : function () {
				return JSON.parse(webStorage.get('workouts') || []);
			},
			updatePrevWorkouts : function (workouts) {
				webStorage.add('workouts', JSON.stringify(workouts), Infinity);
			},

			addExercises : function (exerciseId, exerciseSets, exerciseModel) {
				var entry = {
					"exerciseId" : exerciseId,
					"setGroups" : exerciseSets,
				};

				if(exerciseId == -1) { //new exercise
					entry.model = exerciseModel;
				}

				globalState.workout.exercises = globalState.workout.exercises.concat(entry);
				webStorage.add('ls_workout', JSON.stringify(globalState.workout));
			},

			addWorkout : function (workout) {
				var workouts = this.getPrevWorkouts();
				workouts.unshift(workout);
				this.updatePrevWorkouts(workouts);
			},
		};
	}]).
	factory('exerciseService', ['$http', function ($http) {
		var exercises = null;
	    var promise = $http.get('data/exercises.json', {cache: true}).success(function (data) {
			exercises = data;
		});

	    return {
	    	promise	:	promise,
	    	getExercises	:	function () {
	    		return exercises;
	    	}
	    };
	}]);