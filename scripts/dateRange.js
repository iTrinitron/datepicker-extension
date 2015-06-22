/*
 * Documentation
 *
 */

'use strict';

var Module = angular.module('datePicker');

Module.directive('dateRange', function () {
  return {
    templateUrl: 'templates/daterange.html',
    scope: {
      start: '=',
      end: '='
    },
    link: function (scope, element, attrs) {
        /* 
         * Broadcast event
         * @author Michael C
         */
        scope.next = function () {
            scope.$broadcast("next");
        };
        scope.prev = function() {
            scope.$broadcast("prev");
        };

      /*
       * If no date is set on scope, set current date from user system
       */
      var today = new Date();
      var now = new Date();
        if (now.getMonth() == 11) {
            var current = new Date(now.getFullYear() + 1, 0, 1);
        } else {
            var current = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        }
      var nextMonth = new Date().setMonth(today.getMonth() + 1);
      //console.log(current);
      //console.log(today);
      scope.start = new Date(scope.start || today); //Current Date
      scope.end = new Date(scope.end || current); //Current Date + 1 month .setMonth(this.getMonth()+1))

      attrs.$observe('disabled', function(isDisabled){
          scope.disableDatePickers = !!isDisabled;
        });
      scope.$watch('start.getTime()', function (value) {
        if (value && scope.end && value > scope.end.getTime()) {
          scope.end = new Date(value);
        }
      });
      scope.$watch('end.getTime()', function (value) {
        if (value && scope.start && value < scope.start.getTime()) {
          scope.start = new Date(value);
        }
      });
    }
  };
});