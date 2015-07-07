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
        //maxStartDateOffset: '@',
        selectedStartDate: '=fromDate',
        selectedEndDate: '=toDate',
        viewMode: '@',
        dateOutputFormat: '@',
        //dateLegalFormats: '='
        startPlaceholderText: '@',
        endPlaceholderText: '@',
        minStartDate: '@',
        maxStartDate: '@',
        minEndDate: '@',
        maxEndDate: '@'
        
    },
    //Define controller functions to be passed down to the datePicker directive
    controller: function($scope) {
        /*
         * Directive attribute defaults
         */
        
        //Default month to start the datePicker calendars at
        this.startDate = new Date();
        //Flag to check whether we are picking the start or end date
        $scope.startCal = null;
        this.startCal = null; //version to pass down to datepicker
        //Controls whether or not the dateRange is visible
        $scope.isOpen = false; 
        //Control what view mode we default to
        $scope.viewMode = ($scope.viewMode || "doubleDate")
        //Let us know whether or not an input is in focus
        $scope.startIsFocused = false;
        $scope.endIsFocused = false;
        
        $scope.dateOutputFormat = ($scope.dateOutputFormat || "MMM DD YYYY");
        $scope.startPlaceholderText = ($scope.startPlaceholderText || "");
        $scope.endPlaceholderText = ($scope.endPlaceholderText || "");
        
        this.minStartDate = (new Date($scope.minStartDate) || null);
        this.maxStartDate = (new Date($scope.maxStartDate) || null);
        this.minEndDate = (new Date($scope.minEndDate) || null);
        this.maxEndDate = (new Date($scope.maxEndDate) || null);
        
        /*
         * updateDateRange
         * 
         * Handles the various actions that can occur when the calendar is clicked
         * 
         */
        this.updateDateRange = function() {
            //Close the calendar
            if($scope.viewMode == "doubleDate") {
                this.closeDateRange(); 
            }
            //Cycle through start --> end --> close
            else if($scope.viewMode == "singleDate") {
                $scope.startCal ? this.toggleStartCal() : this.closeDateRange();
            }
            else {
                //Do nothing...
            }
        };
        
        /*
         * Mutators to change the visibility of the dateRange
         * @return boolean
         */
        $scope.openDateRange = function() {
            $scope.isOpen = true;
        };
        this.closeDateRange = function() {
            $scope.isOpen = false;
        };
        
        /*
         * toggleStartCal
         * 
         * Toggles $scope.startCal
         * 
         */
        this.toggleStartCal = function() {
            $scope.startCal = !$scope.startCal;
        };
        
        /*
         * getdayAfterNumDays
         * 
         * Returns a new date object that is numDays amount of days past the
         * given date object
         * 
         * @param javascript Date object
         * @param int numDays
         * @returns javascript Date object
         */
        function getDayAfterNumDays(date, numDays) {
            var newDay = new Date(date);
            newDay.setDate(newDay.getDate() + parseInt(numDays));
            return newDay;
        };
        
        //Pass the variable down
       // this.maxStartDateOffset = getDayAfterNumDays(new Date(), $scope.maxStartDate);
        
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
        $scope.getNextDay = function(date) {
            return getDayAfterNumDays(date, 1);
        };
        
        /*
         * Mutator for the isFocused flag
         * 
         * @param string value
         */
        $scope.setFocus = function(type, value) {
            if(type == "start") {
                $scope.startIsFocused = value;
            }
            else {
                $scope.endIsFocused = value;
            }
        };
        
        /*
         * Mutator for the startCal flag
         * 
         * @param boolean value
         */
        $scope.setStartCal = function(value) {
            $scope.startCal = value;
        };
        
        
        /*
         * Accessor for the startCal flag
         * @return boolean
         */
        this.getStartCal = function() {
            return $scope.startCal;
        };
        
        /*
         * getDefaultDate
         * 
         * Receives the id of the datePicker requesting the defaultDate and
         * returns its respective default date -- default is this and next month
         * 
         * @param int id
         * @returns javascript Date object
         */
        this.getDefaultDate = function(id) {
            var date = new Date();
            //If we are looking at the first datepicker, choose this month
            if(id == 0) {
                return date;
            }
            //If we are looking at the second datepicker, choose next month
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
        //These are the initial dates that appear in the calendar
        scope.selectedStartDate = null;
        scope.selectedEndDate = null;
        
        //These are the initial dates that appear in the input boxes
        scope.visualStartDate = null;
        scope.visualEndDate = null;
        
        //Default to the "L" format
        scope.dateFormat = (scope.dateFormat || "L");
        
        /*
         * Validates a date object
         * 
         * @param javascript Date object d
         * @returns boolean
         */
        function isDate(d) {
            if ( Object.prototype.toString.call(d) === "[object Date]" ) {
                // it is a date
                if ( isNaN( d.getTime() ) ) {  // d.valueOf() could also work
                  // date is not valid
                }
                else {
                  return true;
                }
            }
            
            return false;
        }
        
        /*
         * scope.$watch
         * 
         * Updates the calendar everytime a new input start/end date is entered
         */
        scope.$watch('visualStartDate', function(value) {
            updateDateProt("start", value);
        });
        scope.$watch('visualEndDate', function(value) {
            updateDateProt("end", value);
        }); 
        
        /*
         * updateDate -- called on ng-blur
         * 
         * Updates the calendar's start/end date based on the input's start/end
         * date when the user leaves the input box
         * 
         * @param string value
         */
        scope.updateDate = function(value) {
            //Update the calendar date
            if(value === "start") {
                //Toggle our focus
                scope.setFocus(value, false);
                scope.selectedStartDate = reverseDateInputFormat(scope.visualStartDate);
            }
            else {
                scope.setFocus(value, false);
                scope.selectedEndDate = reverseDateInputFormat(scope.visualEndDate);
            }
        };
        
        /*
         * 
         * @param {type} calType
         * @param {type} value
         * @returns {undefined}
         */
        function updateDateProt(calType, value) {
            if(value != null) {
                var date = new Date(moment(value, scope.dateFormat).format());
                if(isDate(date)) {
                    if(calType === "start") {
                        scope.selectedStartDate = reverseDateInputFormat(value);
                    }
                    else {
                        scope.selectedEndDate = reverseDateInputFormat(value);
                    }
                }
            }
        }
        
        /*
         * formatDateInput
         * 
         * The format that will appear to the user in the input boxes
         * 
         * @unused 
         * 
         * @param javascript Date object
         * @return string "mm/dd/yyyy"
         */
        function formatDateInput(date) {
            var date = moment(date);
            return date.format(scope.dateOutputFormat);
        }
        
        /*
         * reverseDateInputFormat
         * 
         * Parses the date format in the input boxes back to ISO 8601
         * 
         * @param string date
         * @returns javascript Date object
         */
        function reverseDateInputFormat(date) {
            //console.log(scope.dateLegalFormats);
            var momentDate = moment(date, scope.dateOutputFormat);
            return new Date(momentDate.format());
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
        scope.$watch('selectedStartDate', function(date) {
            if(date != null) {
                setSelectedStartDate(date);
            }
        });
        
        scope.$watch('selectedEndDate', function(date) {
            if(date != null) {
                setSelectedEndDate(date);
            }
        });
        
        /*
         * Mutator
         * 
         * Whenever the calendar is changed, we need to update our true value
         * and the visual value displayed
         * 
         * @returns {undefined}
         */
        function setSelectedStartDate(date) {
            scope.selectedStartDate = date;
            if(!scope.startIsFocused) {
                if(isDate(date)) {
                    scope.visualStartDate = formatDateInput(date);
                }
                else {
                    scope.visualStartDate = "";
                }
            }
            //If the end date is not set or the new start is past the end
            if(scope.selectedEndDate == null || scope.selectedStartDate > scope.selectedEndDate || !isDate(scope.selectedEndDate)) {
                setSelectedEndDate(scope.getNextDay(date));
            } 
        }
        function setSelectedEndDate(date) {
            scope.selectedEndDate = date;
            if(!scope.endIsFocused) {
                if(isDate(date)) {
                    scope.visualEndDate = formatDateInput(date);
                }
                else {
                    scope.visualEndDate = "";
                }
            }
            //If the start date is not set or the new end is before the start
            if(scope.selectedEndDate == null ||  scope.selectedEndDate < scope.selectedStartDate || !isDate(scope.selectedStartDate)) {
                setSelectedStartDate(new Date());
            }
        }
        
        
        /*
         * Listener
         * 
         * Changes the start/end inputs whenever a new date is selected on the
         * calendar
         * 
         */
        scope.$on('dateChange2', function(event, pickerId, date) {
           switch(pickerId) {
               case 0: 
                   setSelectedStartDate(date);
                   break;
               case 1: 
                   setSelectedEndDate(date);
                   break;
           }
        });
    }
  };
});