/*
 * datePickerApp Directive
 * 
 * date: 6/22/2015
 * @author Michael C
 */




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
        maxEndDate: '@',
        maxEndDateOffset: '@',
        maxStartDateOffset: '@'
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
        $scope.viewMode = ($scope.viewMode || "doubleDate");
        ($scope.viewMode == "singleDate") ? $scope.isSingle = true : $scope.isSingle = false;
        //Let us know whether or not an input is in focus
        $scope.startIsFocused = false;
        $scope.endIsFocused = false;
        
        $scope.dateOutputFormat = ($scope.dateOutputFormat || "MMM DD YYYY");
        $scope.startPlaceholderText = ($scope.startPlaceholderText || "");
        $scope.endPlaceholderText = ($scope.endPlaceholderText || "");
        
        this.minStartDate = new Date($scope.minStartDate || new Date()).setHours(0, 0, 0, 0);
        this.maxStartDate = new Date($scope.maxStartDate).setHours(0, 0, 0, 0);
        this.minEndDate = new Date($scope.minEndDate || new Date()).setHours(0, 0, 0, 0);
        this.maxEndDate = new Date($scope.maxEndDate).setHours(0, 0, 0, 0);
        
        this.maxEndDateOffset = ($scope.maxEndDateOffset || null);
        
        var maxEndDates = new Array();
        
        this.getMaxEndDate = function() {
            if($scope.selectedStartDate != null) {
                var date = $scope.selectedStartDate;
                if(maxEndDates[date] == null) {
                    maxEndDates[date] = getDayAfterNumDays(date, this.maxEndDateOffset);
                }
                return maxEndDates[date];
            }
            return null;
        };
        
        $scope.debug = function() {
            console.log($scope.selectedStartDate);
            console.log($scope.selectedEndDate);
            console.log($scope.visualStartDate);
            console.log($scope.visualEndDate);
            console.log("---------------------")
        };
        
        this.getSelectedStartDate = function() {
            return $scope.selectedStartDate;
        };
        this.getSelectedEndDate = function() {
            return $scope.selectedEndDate;
        };
        
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
            /* Toggle is off for this build
            else if($scope.viewMode == "singleDate") {
                $scope.startCal ? this.toggleStartCal() : this.closeDateRange();
            } */
            else {
                this.closeDateRange(); 
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
        scope.calChange = function(calType) {
          scope.updateDate(calType);  
        };
        
        /*
         * updateDate -- called on ng-blur
         * 
         * Updates the calendar's start/end date based on the input's start/end
         * date when the user leaves the input box
         * 
         * This makes the input boxes default if there is invalid input
         * 
         * @param string value
         */
        scope.updateDate = function(calType) { 
            var selectedDate = function(x) { scope.selectedEndDate = x };
            var date = scope.visualEndDate;
            if(calType === "start") {
                //Hack to pass by reference?
                selectedDate = function(x) { scope.selectedStartDate = x };
                date = scope.visualStartDate;
            }

            scope.setFocus(calType, false);
            //Make sure it isn't null -- so we don't automatically present a default date
            if(date != null) {
                if(isDate(reverseDateInputFormat(date)) || date == "") {
                    selectedDate(reverseDateInputFormat(date));
                }
            }
        }; 
        
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
            //True designates strict parsing
            var momentDate = moment(date, scope.dateOutputFormat, true);
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
            console.log(date);
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
            //If the new start is past the end
            if(scope.selectedEndDate != "" && (scope.selectedStartDate > scope.selectedEndDate || !isDate(scope.selectedEndDate))) {
                setSelectedEndDate("");
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
            if(scope.selectedEndDate != "" &&  (scope.selectedEndDate < scope.selectedStartDate || !isDate(scope.selectedStartDate))) {
                setSelectedStartDate("");
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