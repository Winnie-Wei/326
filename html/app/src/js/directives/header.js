'use strict';

/**
 * @ngdoc function
 * @name myappApp.directive:SysConfigCtrl
 * @description
 * # SysConfigCtrl
 * Controller of the myappApp
 * author: tangb
 * modified: xieq
 */

 angular.module('myappApp')
.directive('headerDirective', function() {
	return {
		restrict: "EA",
		templateUrl: '/capaa/html/app/views/public/header.html',
		replace: false,
		scope: {},
		controller: 'HeaderCtrl'
	}
})