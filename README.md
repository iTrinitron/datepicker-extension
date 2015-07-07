# datepicker-extension
Extension of https://github.com/g00fy-/angular-datepicker

###BUILD

```
grunt
```

###RUN

```
index.html
```

###Directive
```
<div date-picker-app on-cal-click="rotate" view-mode="doubleDate" max-start-date="330" data-from-date="formData.fromDate" data-to-date="formData.toDate"></div>
```

----------

##Directive Attributes

#### from-date
Type: `Date`  

This is the value of the end date picked on the dateRange in ISO 8601

#### start-date
Type: `Date`  

This is the value of the start date picked on the dateRange in ISO 8601

#### date-output-format
Type: `String`  
Default: `MMM DD YYYY`

[MomentJS](http://momentjs.com/) format that is outputted by the calendar pickers

#### view-mode
Type: `String`  
Default: `doubleDate`

Choose between a single dateRange view or two single date inputs

#### start-placeholder-text
Type: `String`  
Default: ``

Placeholder text to place in the start input box

#### end-placeholder-text
Type: `String`  
Default: ``

Placeholder text to place in the end input box

-------------

Further optimization

1. Swap $watch on the input for an ng-change
2. Change startCal toggle on/off to not update (causing an entire calendar wipe and rebuild), and instead add/remove the disabled class