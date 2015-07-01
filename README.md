# datepicker-extension
Extension of https://github.com/g00fy-/angular-datepicker

BUILD

```
grunt
```

RUN

```
index.html
```

----------

Directive
```
<div date-picker-app on-cal-click="rotate" view-mode="doubleDate" max-start-date="330" data-from-date="formData.fromDate" data-to-date="formData.toDate"></div>
```

on-cal-click: 
rotate: changes the date selection by rotation (start --> end --> close)
close (default): closes the date range picker on date selection

view-mode:
singleDate: displays two date inputs
doubleDate: displays one readonly date range input 

max-start-date: (int)
furthest start date from today

