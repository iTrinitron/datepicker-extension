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
        startMonth: '=',
        maxStartDate: '@',
        selectedStartDate: '=fromDate',
        selectedEndDate: '=toDate',
        viewMode: '@',
        onCalClick: '@',
        dateFormat: '@'
    },
    //Define controller functions to be passed down to the datePicker directive
    controller: function($scope) {
        //Default month to start the datePicker calendars at
        this.startDate = new Date();
        //Flag to check whether we are picking the start or end date
        $scope.startCal = null;
        $scope.isOpen = false; //variable controls whether or not the dateRange is visible
        
        this.onCalClick = ($scope.onCalClick || "close");
        
        /*
         * updateDateRange
         * 
         * Handles the various actions that can occur when the calendar is clicked
         * 
         */
        this.updateDateRange = function() {
            //Close the calendar
            if(this.onCalClick === "close") {
                this.closeDateRange(); 
            }
            //Rotate from start --> end --> close
            else if(this.onCalClick === "rotate") {
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
        this.getDayAfterNumDays = function(date, numDays) {
            var newDay = new Date(date);
            newDay.setDate(newDay.getDate() + parseInt(numDays));
            return newDay;
        };
        
        //Pass the variable down
        this.maxStartDate = this.getDayAfterNumDays(new Date(), $scope.maxStartDate);
        
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
        
        scope.dateFormat = (scope.dateFormat || "L");
        
        scope.$watch('visualStartDate', function(value) {
            if(value != null) {
                scope.selectedStartDate = moment(value, scope.dateFormat).format();
                console.log(scope.selectedStartDate);
                console.log(scope.dateFormat);
            }
        });
        
        scope.$watch('visualEndDate', function(value) {
            if(value != null) {
                scope.selectedEndDate = moment(value, scope.dateFormat).format();
            }
        }); 
        
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
            return date.format(scope.dateFormat);
        }
        
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
            scope.visualStartDate = formatDateInput(date);
        }
        function setSelectedEndDate(date) {
            scope.selectedEndDate = date;
            scope.visualEndDate = formatDateInput(date);
        }
        
        
        /*
         * Listener
         * 
         * Changes the start/end inputs whenever a new date is selected on the
         * calendar
         * 
         */
        scope.$on('dateChange2', function(event, pickerId, date) {
           //date = formatDateInput(date);
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