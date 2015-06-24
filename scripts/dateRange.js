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
             * If no date is set on scope, set current date from user system
             */
   
              
              //This is both the value.. and the month look?
              
              //THIS IS THE DEFAULT SELECTED DATE ON THE CALENDAR
            //scope.start = new Date(); //Current Date
           //scope.end = new Date(); //
            

            attrs.$observe('disabled', function(isDisabled){
                scope.disableDatePickers = !!isDisabled;
              });
            
            /*
            * Listener
            * 
            * Changes the start/end inputs whenever a new date is selected on the
            * calendar
            * 
            */
           scope.$on('dateChange', function(event, date) {
               console.log("date set");
              processChange(date);
           });
           
           function getNextDay(date) {
               var tomorrow = new Date(date);
               tomorrow.setDate(tomorrow.getDate() + 1);
               return tomorrow;
           }
           
           function getPrevDay(date) {
               var tomorrow = new Date(date);
               tomorrow.setDate(tomorrow.getDate() - 1);
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
             */
            function processChange(value) {
                value = new Date(value);
                console.log(value + " was clicked");
                //If we are working with the start input
                if(cntrl.getStartCal()) {
                    scope.start = value; 
                    
                    if(scope.oldEnd == null) {
                            scope.oldEnd = new Date(value);
                        }
                    if(scope.end == null) {
                        console.log("NULL");
                        scope.end = getNextDay(value);
                        
                    }
                    console.log("oldend is" + scope.oldEnd);
                    
                    //Set the input to the start
                    scope.start = value;
                    console.log(scope.end);
                    if(value > scope.end.getTime()) {
                        scope.end = getNextDay(value);
                    }
                }
                else {
                    scope.oldEnd = value;
                    if(scope.start == null) {
                        scope.start = getPrevDay(value);
                    }
                    scope.end = value;
                    if (value < scope.start.getTime()) {
                        scope.start = getPrevDay(value);
                    }
                }
                
                console.log("start is now: " + scope.start);
                console.log("end is now: " + scope.end);
                console.log("----------\n");
            }
            scope.$watch('start.getTime()', function (value) {
                if(value != null) {
                    value = new Date(value);
                    scope.$emit('dateChange2', 0, value);
                }
            });
            scope.$watch('end.getTime()', function (value) {
                if(value != null) {
                    value = new Date(value);
                    scope.$emit('dateChange2', 1, value);
                }
            });
        }
    };
});