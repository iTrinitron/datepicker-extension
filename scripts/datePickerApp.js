/*
 * datePickerApp Directive
 * 
 * date: 6/22/2015
 * @author Michael C
 */

'use strict';

//Build off of the datePicker module
var Module = angular.module('datePicker');

/*
 * datePickerApp Directive
 */
Module.directive('datePickerApp', function () {
  return {
    templateUrl: 'templates/datepickerapp.html',
    scope: {
        startMonth: '='
    },
    //Define controller functions to be passed down to the datePicker directive
    controller: function($scope) {
        $scope.startCal = null;
        
        //Default month to start the datePicker calendars at
        this.startDate = new Date();
        this.getStartCal = function() {
            //console.log("input startCal is " + $scope.startCal);
            return $scope.startCal;
        };
        
        /*
         * getDefaultDate
         * 
         * Receives the id of the datePicker requesting the defaultDate and
         * returns its respective default date
         * 
         * @param int id
         * @returns javascript Date object
         */
        this.getDefaultDate = function(id) {
            var date = new Date();
            if(id == 0) {
                return date;
            }
            return this.getNextMonth(date);
        };
        
        /*
         * getNextMonth
         * 
         * Returns a new date object that is one month ahead of the passed date
         * object
         * 
         * @param javascript Date object
         * @returns javascript Date object
         */
        this.getNextMonth = function(date) {
            if (date == 11) {
                return new Date(date.getFullYear() + 1, 0, 1);
            }
            
            return new Date(date.getFullYear(), date.getMonth() + 1, 1);
            
        };
         
    },
    link: function (scope, element, attrs) {
        //Initialize the start/end date inputs as empty containers
        scope.selectedStartDate = null;
        scope.selectedEndDate = null;
        
        /*
         * formatDateInput
         * 
         * @param javascript Date object
         * @return string "mm/dd/yyyy"
         */
        function formatDateInput(date) {
            var dateStr = (date.getMonth()+1) + "/" + date.getDate() + "/" + date.getFullYear();
            return dateStr;
        }
        
        /*
         * Listener
         * 
         * Changes the start/end inputs whenever a new date is selected on the
         * calendar
         * 
         */
        scope.$on('dateChange2', function(event, pickerId, date) {
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