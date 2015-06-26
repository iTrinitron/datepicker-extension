/* 
 * dateRange Directive
 * @library https://github.com/g00fy-/angular-datepicker
 * 
 * date: 6/22/2015
 * @modified Michael Chin
 */

'use strict';

//Build off of the datePicker module
var Module = angular.module('datePicker');

/*
 * dateRange Directive
 */
Module.directive('dateRange', function () {
    return {
        require: '^datePickerApp',
        templateUrl: 'templates/daterange.html',
        scope: {
            start: '=',
            end: '='
        },
        link: function (scope, element, attrs, cntrl) {
            /* 
             * Broadcast Event
             * 
             * Tell the datePicker to change months whenever a next/prev call
             * is made on the dateRange
             * 
             * @author Michael C
             */
            scope.next = function () {
                scope.$broadcast("next");
                console.log(scope.start);
            };
            scope.prev = function() {
                scope.$broadcast("prev");
            };
            
            /*
            * Listener
            * 
            * Calls the function to change the start/end inputs whenever a new 
            * date is selected on the calendar
            * 
            * @author Michael C
            */
           scope.$on('dateChange', function(event, date) {
              processChange(date);
           });
           
           /*
            * getNextDay
            * 
            * Returns a new date object that is one day ahead of the passed
            * in date object
            * 
            * @param javascript Date object
            * @returns javascript Date object
            * 
            * @author Michael C
            */
           function getNextDay(date) {
               var tomorrow = new Date(date);
               tomorrow.setDate(tomorrow.getDate() + 1);
               return tomorrow;
           }
      
            /*
             * processChange
             * 
             * Hack to cover the calendar.  Currently, the calendars act as two
             * individual start/end datePickers.  We need to ignore that fact,
             * and add our own evaluation to decide whether or not we looking
             * at the start/end dateRange
             * 
             * @param javascript Date object - date selected on either datePicker
             * 
             * @author Michael C
             */
            function processChange(value) {
                //If we are working with the start input
                if(cntrl.getStartCal()) {
                    //Update the new start value
                    scope.start = value; 
   
                    //If the end date is not set or the new start is past the end
                    if(scope.end == null || value > scope.end.getTime()) {
                        scope.end = getNextDay(value);
                    }
                }
                //If we are working with the end input
                else {
                    scope.end = value;
                    //If the start date is not set or the new end is before the start
                    if(scope.start == null || value < scope.start.getTime()) {
                        scope.start = new Date();
                    }
                }
                
                //Autoclose after selection
                scope.$emit('closeDateRange');
            }
            
            /*
             * scope.$watch
             * 
             * Updates the inputs everytime a new date is selected on the calendar
             * 
             * @param date string
             * 
             * @author Michael C
             */
            scope.$watch('start.getTime()', function (value) {
                //Make sure that we are not capturing its initialization 
                if(value != null) {
                    value = new Date(value);
                    scope.$emit('dateChange2', 0, value);
                }
            });
            scope.$watch('end.getTime()', function (value) {
                //Make sure that we are not capturing its initialization 
                if(value != null) {
                    value = new Date(value);
                    scope.$emit('dateChange2', 1, value);
                }
            });
            
            attrs.$observe('disabled', function(isDisabled){
                scope.disableDatePickers = !!isDisabled;
            });
        }
    };
});