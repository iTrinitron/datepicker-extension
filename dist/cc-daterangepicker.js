/* 
 * datePicker Directive
 * @library https://github.com/g00fy-/angular-datepicker
 * 
 * date: 6/22/2015
 * @modified Michael Chin
 */

/*
 * For the modified version of dateRange, only the 'date' view is used.  All 
 * other views are untested, and may not functinoal correctly.
 * i.e. scope.view = 'date' ALWAYS
 * 
 * scope.model represents the start/end date visible on the datePicker.  Never 
 * allow it to change itself.  Always modify scope.model through it's binding
 * on model: '=datePicker'
 * 
 */

'use strict';

var Module = angular.module('datePicker', []);

Module.constant('datePickerConfig', {
  template: 'templates/datepicker.html',
  view: 'month',
  views: ['year', 'month', 'date', 'hours', 'minutes'],
  step: 5
});

Module.filter('time',function () {
  function format(date){
    return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
  }

  return function (date) {
    if (!(date instanceof Date)) {
      date = new Date(date);
      if (isNaN(date.getTime())) {
        return undefined;
      }
    }
    return format(date);
  };
});

Module.directive('datePicker', ['datePickerConfig', 'datePickerUtils', function datePickerDirective(datePickerConfig, datePickerUtils) {

  //noinspection JSUnusedLocalSymbols
  return {
    require: ['?ngModel', '^datePickerApp'],
    template: '<div ng-include="template"></div>',
    scope: {
      model: '=datePicker',
      after: '=?',
      before: '=?',
      pid: '='
    },
    controller: function($scope) {
        
    },
    link: function (scope, element, attrs, cntrl) {
        var ngModel = cntrl[0];
        var datePickerApp = cntrl[1];
        
       /*
        * Listener
        * 
        * Changes the months whenever the next/prev button is clicked on the
        * dateRange directive
        * 
        * @author Michael C
        */
      scope.$on("next", function() {
         scope.next();
      });
      scope.$on("prev", function() {
         scope.prev();
      });  
      
      var arrowClick = false;

      //Set the date of the datePicker THIS IS THE DEFAULT CALENDAR POSITION
      scope.date = new Date(datePickerApp.getDefaultDate(scope.pid));
      
      scope.views = datePickerConfig.views.concat();
      scope.view = attrs.view || datePickerConfig.view;
      scope.now = new Date();
      scope.template = attrs.template || datePickerConfig.template;
      var step = parseInt(attrs.step || datePickerConfig.step, 10);
      var partial = !!attrs.partial;

      //if ngModel, we can add min and max validators
      /*
      if(ngModel)
      {
        if (angular.isDefined(attrs.minDate)) {
          console.log("Min defined");
          var minVal;
          ngModel.$validators.min = function (value) {
            return !datePickerUtils.isValidDate(value) || angular.isUndefined(minVal) || value >= minVal;
          };
          attrs.$observe('minDate', function (val) {
            minVal = new Date(val);
            ngModel.$validate();
          });
        } 

        if (angular.isDefined(attrs.maxDate)) {
          var maxVal;
          ngModel.$validators.max = function (value) {
            return !datePickerUtils.isValidDate(value) || angular.isUndefined(maxVal) || value <= maxVal;
          };
          attrs.$observe('maxDate', function (val) {
            maxVal = new Date(val);
            ngModel.$validate();
          });
        }
      } */
      //end min, max date validator

      /** @namespace attrs.minView, attrs.maxView */
      scope.views =scope.views.slice(
        scope.views.indexOf(attrs.maxView || 'year'),
        scope.views.indexOf(attrs.minView || 'minutes')+1
      );

      if (scope.views.length === 1 || scope.views.indexOf(scope.view)===-1) {
        scope.view = scope.views[0];
      }

      scope.setView = function (nextView) {
        if (scope.views.indexOf(nextView) !== -1) {
          scope.view = nextView;
        }
      };

      scope.setDate = function (date, month) {
        //Do nothing if the date is disabled
        if(attrs.disabled || scope.isDisabled(date, month)) {
          return;
        }
        scope.date = date;
        // change next view
        var nextView = scope.views[scope.views.indexOf(scope.view) + 1];
        if ((!nextView || partial) || scope.model) {

          //scope.model = new Date(date);
          //if ngModel , setViewValue and trigger ng-change, etc...
          
          if(ngModel) {
            ngModel.$setViewValue(scope.date);
          } 

          var view = partial ? 'minutes' : scope.view;
          //noinspection FallThroughInSwitchStatementJS
          switch (view) {
          case 'minutes':
            scope.model.setMinutes(date.getMinutes());
          /*falls through*/
          case 'hours':
            scope.model.setHours(date.getHours());
          /*falls through*/
          
          //This is the default case set by dateRange --
          case 'date':
            //Let the dateRange know that it has been changed
            scope.$emit('dateChange', new Date(date));
            break;
          /*falls through*/
          case 'month':
            scope.model.setMonth(date.getMonth());
          /*falls through*/
          case 'year':
            scope.model.setFullYear(date.getFullYear());
          }
          scope.$emit('setDate', scope.model, scope.view);
        }

        if (nextView) {
          scope.setView(nextView);
        }

        if(!nextView && attrs.autoClose === 'true'){
          element.addClass('hidden');
          scope.$emit('hidePicker');
        }
      };
      
      /*
       * @author Michael
       */
      scope.$on('hidePickers', function() {
          element.addClass('hidden');
          scope.$emit('hidePicker');
      });

      function update() {
        var view = scope.view;

        if (scope.model && !arrowClick) {
          scope.date = new Date(scope.model);
          arrowClick = false;
        }
        var date = scope.date;

        switch (view) {
        case 'year':
          scope.years = datePickerUtils.getVisibleYears(date);
          break;
        case 'month':
          scope.months = datePickerUtils.getVisibleMonths(date);
          break;
        case 'date':
          scope.weekdays = scope.weekdays || datePickerUtils.getDaysOfWeek();
          scope.weeks = datePickerUtils.getVisibleWeeks(date);
          break;
        case 'hours':
          scope.hours = datePickerUtils.getVisibleHours(date);
          break;
        case 'minutes':
          scope.minutes = datePickerUtils.getVisibleMinutes(date, step);
          break;
        }
      }

      function watch() {
        if (scope.view !== 'date') {
          return scope.view;
        }
        return scope.date ? scope.date.getMonth() : null;
      }


      scope.$watch(watch, update);

      scope.next = function (delta) {
        var date = scope.date;
        delta = delta || 1;
        switch (scope.view) {
        case 'year':
        /*falls through*/
        case 'month':
          date.setFullYear(date.getFullYear() + delta);
          break;
        case 'date':
          /* Reverting from ISSUE #113
          var dt = new Date(date);
          date.setMonth(date.getMonth() + delta);
          if (date.getDate() < dt.getDate()) {
            date.setDate(0);
          }
          */
          date.setMonth(date.getMonth() + delta);
          break;
        case 'hours':
        /*falls through*/
        case 'minutes':
          date.setHours(date.getHours() + delta);
          break;
        }
        arrowClick = true;
        update();
      };

      scope.prev = function (delta) {
        return scope.next(-delta || -1);
      };

      scope.isAfter = function (date) {
        return scope.after && datePickerUtils.isAfter(date, scope.after);
      };

      scope.isBefore = function (date) {
        return scope.before && datePickerUtils.isBefore(date, scope.before);
      };

      scope.isSameMonth = function (date) {
        return datePickerUtils.isSameMonth(scope.model, date);
      };

      scope.isSameYear = function (date) {
        return datePickerUtils.isSameYear(scope.model, date);
      };

      scope.isSameDay = function (date) {
        return datePickerUtils.isSameDay(scope.model, date);
      };

      scope.isSameHour = function (date) {
        return datePickerUtils.isSameHour(scope.model, date);
      };

      scope.isSameMinutes = function (date) {
        return datePickerUtils.isSameMinutes(scope.model, date);
      };
      
      /*
       * isDisabled
       * 
       * Checks to see if a given day is within the valid dates
       * -the day is on or after today's date
       * -the day is within the given month it appears in
       * 
       * @param javascript Date object day
       * @param javascript Date object date
       * @return boolean
       * 
       * @author Michael C
       */
      scope.isDisabled = function(day, date) {
          //If the day is past the max-start-date
          if(day > datePickerApp.maxStartDate) {
              return true;
          }
          //If the day is past the start date
          //console.log(datePickerApp);
          
          if((day.getMonth() != date.getMonth())) {
              return true;
          }
          if(day < new Date()) {
              return true;
          }
          return false;
      };

      scope.isNow = function (date) {
        var is = true;
        var now = scope.now;
        //noinspection FallThroughInSwitchStatementJS
        switch (scope.view) {
        case 'minutes':
          is &= ~~(date.getMinutes()/step) === ~~(now.getMinutes()/step);
        /*falls through*/
        case 'hours':
          is &= date.getHours() === now.getHours();
        /*falls through*/
        case 'date':
          is &= date.getDate() === now.getDate();
        /*falls through*/
        case 'month':
          is &= date.getMonth() === now.getMonth();
        /*falls through*/
        case 'year':
          is &= date.getFullYear() === now.getFullYear();
        }
        return is;
      };
    }
  };
}]);
'use strict';

angular.module('datePicker').factory('datePickerUtils', function(){
  var createNewDate = function(year, month, day, hour, minute) {
    // without any arguments, the default date will be 1899-12-31T00:00:00.000Z
    return new Date(year | 0, month | 0, day | 0, hour | 0, minute | 0);
  };
  return {
    getVisibleMinutes : function(date, step) {
      date = new Date(date || new Date());
      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();
      var hour = date.getUTCHours();
      var minutes = [];
      var minute, pushedDate;
      for (minute = 0 ; minute < 60 ; minute += step) {
        pushedDate = createNewDate(year, month, day, hour, minute);
        minutes.push(pushedDate);
      }
      return minutes;
    },
    getVisibleWeeks : function(date) {
      date = new Date(date || new Date());
      var startMonth = date.getMonth();
      var startYear = date.getYear();
      // set date to start of the week
      date.setDate(1);

      if (date.getDay() === 0) {
        // day is sunday, let's get back to the previous week
        date.setDate(-5);
      } else {
        // day is not sunday, let's get back to the start of the week
        date.setDate(date.getDate() - (date.getDay() - 1));
      }
      if (date.getDate() === 1) {
        // day is monday, let's get back to the previous week
        date.setDate(-6);
      }

      var weeks = [];
      var week;
      while (weeks.length < 6) {
        if (date.getYear() === startYear && date.getMonth() > startMonth) {
          break;
        }
        week = this.getDaysOfWeek(date);
        weeks.push(week);
        date.setDate(date.getDate() + 7);
      }
      return weeks;
    },
    getVisibleYears : function(date) {
      date = new Date(date || new Date());
      date.setFullYear(date.getFullYear() - (date.getFullYear() % 10));
      var year = date.getFullYear();
      var years = [];
      var pushedDate;
      for (var i = 0; i < 12; i++) {
        pushedDate = createNewDate(year);
        years.push(pushedDate);
        year++;
      }
      return years;
    },
    getDaysOfWeek : function(date) {
      date = new Date(date || new Date());
      date.setDate(date.getDate() - (date.getDay() - 1));
      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();
      var days = [];
      var pushedDate;
      for (var i = 0; i < 7; i++) {
        pushedDate = createNewDate(year, month, day);
        days.push(pushedDate);
        day++;
      }
      return days;
    },
    getVisibleMonths : function(date) {
      date = new Date(date || new Date());
      var year = date.getFullYear();
      var months = [];
      var pushedDate;
      for (var month = 0; month < 12; month++) {
        pushedDate = createNewDate(year, month, 1);
        months.push(pushedDate);
      }
      return months;
    },
    getVisibleHours : function(date) {
      date = new Date(date || new Date());
      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();
      var hours = [];
      var hour, pushedDate;
      for (hour = 0 ; hour < 24 ; hour++) {
        pushedDate = createNewDate(year, month, day, hour);
        hours.push(pushedDate);
      }
      return hours;
    },
    isAfter : function(model, date) {
      model = (model !== undefined) ? new Date(model) : model;
      date = new Date(date);
      return model && model.getTime() >= date.getTime();
    },
    isBefore : function(model, date) {
      model = (model !== undefined) ? new Date(model) : model;
      date = new Date(date);
      return model.getTime() <= date.getTime();
    },
    isSameYear :   function(model, date) {
      model = (model !== undefined) ? new Date(model) : model;
      date = new Date(date);
      return model && model.getFullYear() === date.getFullYear();
    },
    isSameMonth : function(model, date) {
      model = (model !== undefined) ? new Date(model) : model;
      date = new Date(date);
      return this.isSameYear(model, date) && model.getMonth() === date.getMonth();
    },
    isSameDay : function(model, date) {
      model = (model !== undefined) ? new Date(model) : model;
      date = new Date(date);
      return this.isSameMonth(model, date) && model.getDate() === date.getDate();
    },
    isSameHour : function(model, date) {
      model = (model !== undefined) ? new Date(model) : model;
      date = new Date(date);
      return this.isSameDay(model, date) && model.getHours() === date.getHours();
    },
    isSameMinutes : function(model, date) {
      model = (model !== undefined) ? new Date(model) : model;
      date = new Date(date);
      return this.isSameHour(model, date) && model.getMinutes() === date.getMinutes();
    },
    isValidDate : function(value) {
      // Invalid Date: getTime() returns NaN
      return value && !(value.getTime && value.getTime() !== value.getTime());
    }
  };
});
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
/* 
 * dateInput Directive
 * 
 * Directive to handle dateInputs that handle formatted date
 * 
 * date: 7/2/2015
 * @author Michael C
 */

/*
 * 
 * 
 */

'use strict';

var Module = angular.module('datePicker');

Module.directive('dateInput', function() {
    return {
        require: '?ngModel',
        scope: {
            dateValue: '='
        },
        controller: function($scope) {
            $scope.fixDate = function(d){
                //var newDate = new Date.create(d).toString();
                //console.log(newDate);
                $scope.dateValue = "help";

            };
        },
        link: function(scope, element, attrs, ngModel) {
            
        }			
    };
});
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
        dateFormat: '@'
    },
    //Define controller functions to be passed down to the datePicker directive
    controller: function($scope) {
        //Default month to start the datePicker calendars at
        this.startDate = new Date();
        //Flag to check whether we are picking the start or end date
        $scope.startCal = null;
        //Controls whether or not the dateRange is visible
        $scope.isOpen = false; 
        //Control what view mode we default to
        $scope.viewMode = ($scope.viewMode || "doubleDate")
        //Let us know whether or not an input is in focus
        $scope.startIsFocused = false;
        $scope.endIsFocused = false;
        
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
        this.maxStartDate = getDayAfterNumDays(new Date(), $scope.maxStartDate);
        
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
            return date.format(scope.dateFormat);
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
            return new Date(moment(date, scope.dateFormat).format());
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
                scope.visualStartDate = formatDateInput(date);
            }
            //If the end date is not set or the new start is past the end
            if(scope.selectedEndDate == null || scope.selectedStartDate > scope.selectedEndDate || !isDate(scope.selectedEndDate)) {
                setSelectedEndDate(scope.getNextDay(date));
            } 
        }
        function setSelectedEndDate(date) {
            scope.selectedEndDate = date;
            if(!scope.endIsFocused) {
                scope.visualEndDate = formatDateInput(date);
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
'use strict';

var PRISTINE_CLASS = 'ng-pristine',
    DIRTY_CLASS = 'ng-dirty';

var Module = angular.module('datePicker');

Module.constant('dateTimeConfig', {
  template: function (attrs) {
    return '' +
        '<div ' +
        'date-picker="' + attrs.ngModel + '" ' +
        (attrs.view ? 'view="' + attrs.view + '" ' : '') +
        (attrs.maxView ? 'max-view="' + attrs.maxView + '" ' : '') +
        (attrs.autoClose ? 'auto-close="' + attrs.autoClose + '" ' : '') +
        (attrs.template ? 'template="' + attrs.template + '" ' : '') +
        (attrs.minView ? 'min-view="' + attrs.minView + '" ' : '') +
        (attrs.partial ? 'partial="' + attrs.partial + '" ' : '') +
        (attrs.step ? 'step="' + attrs.step + '" ' : '') +
        'class="date-picker-date-time"></div>';
  },
  format: 'yyyy-MM-dd HH:mm',
  views: ['date', 'year', 'month', 'hours', 'minutes'],
  dismiss: false,
  position: 'relative'
});



Module.directive('dateTimeAppend', function () {
  return {
    link: function (scope, element) {
      element.bind('click', function (e) {
          console.log("e is: " + e);
        element.find('input')[0].focus();
      });
    }
  };
});

Module.directive('dateTime', ['$compile', '$document', '$filter', 'dateTimeConfig', '$parse', 'datePickerUtils',
                function ($compile, $document, $filter, dateTimeConfig, $parse, datePickerUtils) {
  var body = $document.find('body');
  var dateFilter = $filter('date');

  return {
    require: 'ngModel',
    scope:true,
    link: function (scope, element, attrs, ngModel) {
      var format = attrs.format || dateTimeConfig.format;
      var parentForm = element.inheritedData('$formController');
      var views = $parse(attrs.views)(scope) || dateTimeConfig.views.concat();
      var view = attrs.view || views[0];
      var index = views.indexOf(view);
      var dismiss = attrs.dismiss ? $parse(attrs.dismiss)(scope) : dateTimeConfig.dismiss;
      var picker = null;
      var position = attrs.position || dateTimeConfig.position;
      var container = null;

      if (index === -1) {
        views.splice(index, 1);
      }

      views.unshift(view);


      function formatter(value) {
        return dateFilter(value, format);
      }

      function parser() {
        return ngModel.$modelValue;
      }

      ngModel.$formatters.push(formatter);
      ngModel.$parsers.unshift(parser);


      //min. max date validators
      if (angular.isDefined(attrs.minDate)) {
        var minVal;
        ngModel.$validators.min = function (value) {
            return !datePickerUtils.isValidDate(value) || angular.isUndefined(minVal) || value >= minVal;
          };
        attrs.$observe('minDate', function (val) {
            minVal = new Date(val);
            ngModel.$validate();
          });
      }

      if (angular.isDefined(attrs.maxDate)) {
        var maxVal;
        ngModel.$validators.max = function (value) {
            return !datePickerUtils.isValidDate(value) || angular.isUndefined(maxVal) || value <= maxVal;
          };
        attrs.$observe('maxDate', function (val) {
            maxVal = new Date(val);
            ngModel.$validate();
          });
      }
      //end min, max date validator

      var template = dateTimeConfig.template(attrs);

      function updateInput(event) {
        event.stopPropagation();
        if (ngModel.$pristine) {
          ngModel.$dirty = true;
          ngModel.$pristine = false;
          element.removeClass(PRISTINE_CLASS).addClass(DIRTY_CLASS);
          if (parentForm) {
            parentForm.$setDirty();
          }
          ngModel.$render();
        }
      }

      function clear() {
        if (picker) {
          picker.remove();
          picker = null;
        }
        if (container) {
          container.remove();
          container = null;
        }
      }

      function showPicker() {
        if (picker) {
          return;
        }
        // create picker element
        picker = $compile(template)(scope);
        scope.$digest();

        scope.$on('setDate', function (event, date, view) {
          updateInput(event);
          if (dismiss && views[views.length - 1] === view) {
            clear();
          }
        });

        scope.$on('hidePicker', function () {
          element.triggerHandler('blur');
        });

        scope.$on('$destroy', clear);

        // move picker below input element

        if (position === 'absolute') {
          var pos = angular.extend(element.offset(), { height: element[0].offsetHeight });
          picker.css({ top: pos.top + pos.height, left: pos.left, display: 'block', position: position});
          body.append(picker);
        } else {
          // relative
          container = angular.element('<div date-picker-wrapper></div>');
          element[0].parentElement.insertBefore(container[0], element[0]);
          container.append(picker);
//          this approach doesn't work
//          element.before(picker);
          picker.css({top: element[0].offsetHeight + 'px', display: 'block'});
        }

        picker.bind('mousedown', function (evt) {
          evt.preventDefault();
        });
      }

      element.bind('focus', showPicker);
      element.bind('blur', clear);
    }
  };
}]);
