/* 
 * dateInput Directive
 * 
 * Directive to handle dateInputs that handle formatted date
 * 
 * date: 7/2/2015
 * @author Michael C
 */

/*
 * 
 * 
 */

Module.directive('dateInput', function() {
    return {
        require: '?ngModel',
        scope: {
            dateValue: '='
        },
        controller: ["$scope",  function($scope) {
            $scope.fixDate = function(d){
                //var newDate = new Date.create(d).toString();
                //console.log(newDate);
                $scope.dateValue = "help";

            };
        }],
        link: function(scope, element, attrs, ngModel) {
            
        }			
    };
});