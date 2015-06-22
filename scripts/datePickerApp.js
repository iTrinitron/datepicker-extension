/*
 * Documentation
 *
 */

'use strict';

var Module = angular.module('datePicker');

Module.directive('datePickerApp', function () {
  return {
    templateUrl: 'templates/datepickerapp.html',
    scope: {
        
    },
    link: function (scope, element, attrs) {
        scope.selectedStartDate = null;
        scope.selectedEndDate = null;
        scope.test = "TEST";
        
        function formatDateInput(date) {
            var dateStr = (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear();
            return dateStr;
        }
        
        scope.$on('dateChange', function(event, pickerId, date) {
           date = formatDateInput(date);
           switch(pickerId) {
               case 0: 
                   scope.selectedStartDate = date; 
                   break;
               case 1: 
                   scope.selectedEndDate = date;
                   break;
           }
        });
    }
  };
});