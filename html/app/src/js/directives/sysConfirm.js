angular.module('myappApp')
.directive('confirmDiv', function() {
	return {
		restrict: "EAC",
		templateUrl: 'views/public/sysConfirm.html',
		replace: true,
		transclude: false
	};
});