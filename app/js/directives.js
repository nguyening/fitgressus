'use strict';

/* Directives */
angular.module('fitgressus.directives', []).
	directive('appVersion', ['version', function(version) {
		return function(scope, elm, attrs) {
			elm.text(version);
		};
	}]).
	directive('contenteditable', [function() {
		return {
			require: 'ngModel',
			link: function(scope, elm, attrs, ctrl) {
				// view -> model
				elm.bind('blur', function() {
					scope.$apply(function() {
						ctrl.$setViewValue(elm.html());
					});
				});

				// model -> view
				ctrl.$render = function() {
					elm.html(ctrl.$viewValue);
				};
			}
		};
	}]);
