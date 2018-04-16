angular.module('myappApp')
.directive('alertDiv', function() {
	return {
		restrict: "EAC",
		templateUrl: 'views/public/sysAlert.html',
		replace: true,
		transclude: false,
		rootscope: {
			msgErr: '='
		},
		compile: function(tElement, tAttrs, transclude) {
			return function(rootscope, iElement, iAttrs) {
			 	 
				rootscope.$watch('msg', function(newVal, oldVal){
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