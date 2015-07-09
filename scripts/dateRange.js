/* 
 * dateRange Directive
 * @library https://github.com/g00fy-/angular-datepicker
 * 
 * date: 6/22/2015
 * @modified Michael Chin
 */

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
               return cntrl.getDayAfterNumDays(date, 1);
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
                    scope.start = value; 
                }
                //If we are working with the end input
                else {
                    scope.end = value;
                }
                //Autoclose after selection
                cntrl.updateDateRange();
            }
            
            attrs.$observe('disabled', function(isDisabled){
                scope.disableDatePickers = !!isDisabled;
            });
        }
    };
});