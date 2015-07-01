/*
 * datePickerApp Directive
 * 
 * date: 6/22/2015
 * @author Michael C
 */

'use strict';

//Build off of the datePicker module
var Module = angular.module('datePicker');

Module.controller('MyCtrl', ['$scope', function ($scope) {
    $scope.formData = {};
    $scope.formData.fromDate = null;
    $scope.formData.toDate = null;

}])
/*
 * datePickerApp Directive
 */
.directive('datePickerApp', function () {
  return {
    templateUrl: 'templates/datepickerapp.html',
    scope: {
        startMonth: '=',
        maxStartDate: '@',
        selectedStartDate: '=fromDate',
        selectedEndDate: '=toDate',
        viewMode: '@',
        onCalClick: '@'
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
            console.log($scope.startCal);
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
         * @unused 
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
           //date = formatDateInput(date);
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