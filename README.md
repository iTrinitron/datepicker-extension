# datepicker-extension
Extension of (https://github.com/g00fy-/angular-datepicker)

##Requirements
- Angular v1.3.13+
- UI Bootstrap v0.13.0+
- Moment JS v2.10.3+

- Font Awesome
- Bootstrap v3.3.5+

##Getting Started

###BUILD

```
grunt
```

###RUN

```
index.html
```

###Directive Example
```
<div date-picker-app view-mode="doubleDate"></div>
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