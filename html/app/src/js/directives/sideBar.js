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
.directive('sideBarDirective', function() {
	return {
		restrict: "EA",
		templateUrl: '/capaa/html/app/views/public/sideBar.html',
		replace: false,
		scope: {},
		controller: 'SideBarCtrl'
	}
})