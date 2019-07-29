/* exported doGet */
function doGet() {
  var template = HtmlService.createTemplateFromFile("Index");
  var html = template.evaluate();
  html.setTitle("Column Calendar Demo");
  return html;
}

/**
 * Event_ is a stripped down version of the Google Calendar event
 * @param {CalendarEvent} - Google Calendar event
 * @returns object
 */
function Event_(event, calendarName) {
  this.name = event.getTitle();
  this.startHour = event.getStartTime().getHours();
  this.startMinutes = event.getStartTime().getMinutes();
  var endHour = event.getEndTime().getHours();
  // the viewable "day" extends past mightnight
  this.endHour = endHour < this.startHour ? endHour + 24 : endHour;
  this.endMinutes = event.getEndTime().getMinutes();
  this.location = event.getLocation();
  this.originalCalendarId = event.getOriginalCalendarId();
  this.calendarName = calendarName;
}

/**
 * @param {string} request.date - yyyy-mm-dd
 * @param {string} request.id - Google Calendar ID
 * @returns {Event_[]}
 * @see Event_
 */
/* exported getCalendar */
function getCalendar(request) {
  var date = parseDateString_(request.date);
  var cal = CalendarApp.getCalendarById(request.id);
  var name = cal.getName();
  var events = cal.getEventsForDay(date);
  return events.filter(function (event) {
    return ! event.isAllDayEvent();
  }).map(function (event) {
    return new Event_(event, name);
  });
}

/**
 * @param {string} request.date - yyyy-mm-dd
 * @param {string[]} request.ids - Google Calendar IDs
 * @returns {Event_[][]}
 * @see Event_
 */
/* exported getCalendars */
function getCalendars(request) {
  var date = parseDateString_(request.date);
  var calendars = [];
  request.ids.forEach(function (id) {
    var cal = CalendarApp.getCalendarById(id);
    var name = cal.getName();
    var events = cal.getEventsForDay(date);
    calendars.push(events.filter(function (event) {
      return ! event.isAllDayEvent();
    }).map(function (event) {
      return new Event_(event, name);
    }));
  });
  return calendars;
}

/* exported getAllCalendarIDs */
function getAllCalendarIDs() {
  return CalendarApp.getAllCalendars().map(function (cal) {
    return {
      id: cal.getId(),
      name: cal.getName(),
      isMyPrimaryCalendar: cal.isMyPrimaryCalendar()};
  });
}

/* exported include_ */
function include_(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Helper function to turn HTML5 date input into a Date object
 * @param {string} dateString - "yyyy-mm-dd"
 * @returns {Date}
 */
function parseDateString_(dateString) {
  var match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateString);
  if (! match) {
    throw new Error(dateString + " not in yyyy-mm-dd format");
  }
  return new Date([
    "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ][+match[2]] + " " + match[3] + ", " + match[1]);
}
