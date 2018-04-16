
'use strict';

/**
 * @ngdoc function
 * @name myappApp.directive:tableModal
 * @description
 * Controller of the myappApp
 */

 angular.module('myappApp')
.directive('tableModal', function() {
	return {
		restrict: "EAC",
		templateUrl: 'views/public/tableModal.html',
		replace: true,
		scope: {
			hasCheckbox: '=',        // 是否有选框
			actionBtn: '=',         // 表格操作按钮
		},
		link: {
			
		}
	}
})
