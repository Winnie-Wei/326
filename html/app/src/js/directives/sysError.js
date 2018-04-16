/*
 * 全局错误提示弹出层 
 */
angular.module('myappApp')
.directive('errDiv', function() {
	return {
		restrict: "EAC",
		templateUrl: 'views/public/errModal.html',
		replace: true,
		transclude: true,
		rootscope: {
			msgErr: '='
		},
		compile: function(tElement, tAttrs, transclude) {
			return function(rootscope, iElement, iAttrs) {
				
				rootscope.$watch('msgErr', function(newVal, oldVal){
					if(newVal != oldVal && newVal != ""){
						iElement.modal('show');
					}
				});
				tElement.on('hidden.bs.modal', function () {
					rootscope.msgErr = "";
					rootscope.$apply();
			    })
			}
		}
	};
});