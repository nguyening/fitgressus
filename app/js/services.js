
'use strict';

/* Services */
angular.module('fitgressus.services', ['webStorageModule']).
	value('version', '0.1').
	factory('workoutState', ['webStorage', '$location', function (webStorage, $location) {
		// when service is instantiated, pull from web storage
		var	globalState = {
				lastPhase : webStorage.get('ls_lastPhase'),
				currentExercise : webStorage.get('ls_currentExercise'),
				selectedWorkoutType : webStorage.get('ls_selectedWorkoutType'),
				startTime : webStorage.get('ls_startTime'),
				workout : webStorage.get('ls_workout'),
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
					currentExercise	:	globalState.currentExercise,
					selectedWorkoutType	:	globalState.selectedWorkoutType,
					startTime	:	globalState.startTime,
				}, passedState);

				// back up to webStorage in case the user refreshes/crashes
				webStorage.add('ls_lastPhase', lastPhase);
				webStorage.add('ls_currentExercise', state.currentExercise);
				webStorage.add('ls_selectedWorkoutType', state.selectedWorkoutType);
				webStorage.add('ls_startTime', state.startTime);

				globalState.lastPhase =  lastPhase;
				globalState.currentExercise =  state.currentExercise;
				globalState.selectedWorkoutType =  state.selectedWorkoutType;
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

			addExercises : function (exercises) {
				globalState.workout.exercises = globalState.workout.exercises.concat(exercises);
				webStorage.add('ls_workout', JSON.stringify(globalState.workout));
			},

			addWorkout : function (workout) {
				var workouts = this.getPrevWorkouts();
				workouts.unshift(workout);
				this.updatePrevWorkouts(workouts);
			},
		};
	}]);
