'use strict';

/* Directives */
angular.module('fitgressus.directives', []).
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
	}]).
	directive('lineplot', [function () {
		var margin = {top: 20, right: 20, bottom: 70, left: 100};
		var width = 700 - margin.left - margin.right;
		var height = 500 - margin.top - margin.bottom;
		var parseDate = d3.time.format("%Y-%m-%d").parse;
		var axisPadding = 10;

		return {
			scope: {
				data: '=',
				yLabel: '=',
				xLabel: '=',
			},
			link: function (scope, elm, attrs, ctrl) {
				var svg = d3.select(elm[0]).append('svg')
					        .attr("width", width + margin.left + margin.right)
					        .attr("height", height + margin.top + margin.bottom)
						    .append("g")
						    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


				var data = scope.data;

				var x = d3.time.scale()
			        .range([axisPadding, width]);

			    var y = d3.scale.linear()
			    	.domain([0, d3.max(data, function (d) { return d.totalWt; })])
			        .range([height, 0]);

				svg.append('text')
					.attr('x', width/2)
					.attr('y', height + margin.bottom)
					.style('text-anchor', 'middle')
					.text('Workout Date');

				svg.append('text')
					.attr('transform', 'rotate(-90)')
					.attr('x', -height/2)
					.attr('y', x(0) - margin.left)
					.style('text-anchor', 'middle')
					.text('Total Wt (lb)');

			    var xAxis = d3.svg.axis()
			        .scale(x)
			        .orient("bottom")
			    	.tickFormat(d3.time.format("%m/%d"))
			    	.tickSize(-height, 0, 0)
			    	.ticks(7);

			    var yAxis = d3.svg.axis()
			        .scale(y)
			        .orient("left")
			        .tickSize(5, 0);

			    var line = d3.svg.line()
			        .x(function(d) { return x(d.date); })
			        .y(function(d) { return y(d.totalWt); })
			        .interpolate('step-after');

			    data.forEach(function (d) {
					d.date = parseDate(d.date);
				});

			    x.domain(d3.extent(data, function(d) { return d.date; }));
			    y.domain([0, d3.max(data, function(d) { return d.totalWt;})]);

			    // DRAWING
			    svg.append("g")
				    .attr("class", "x axis")
				    .attr("transform", "translate(0," + height + ")")
				    .call(xAxis)
			    	.selectAll('text')
			    		.attr('text-anchor', 'end')
			    		.attr('dx', '-1.8em')
			    		.attr('dy', '1em')
			    		.attr('transform', 'rotate(-45)');

			    svg.append("g")
				    .attr("class", "y axis")
				    .call(yAxis)
				    .selectAll('text')
				    	.attr('transform', 'translate(-5, 0)');

			    svg.append("path")
				    .datum(data)
				    .attr("class", "line")
				    .style("fill", "none")
				    .style("stroke", "teal")
				    .style("stroke-width", 2)
				    .attr("d", line);

				svg.selectAll('circle')
					.data(data)
					.enter().append('circle')
					.attr('r', 3)
					.attr('fill', 'teal')
					.attr('cx', function(d) { return x(d.date); })
					.attr('cy', function(d) { return y(d.totalWt); });
			}
		};
	}]);
