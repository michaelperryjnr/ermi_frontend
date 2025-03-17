import AnimationVariants from "./animations";
import {
  formatDate,
  formatTime,
  generateCalendarDays,
  isToday,
  matchesWeekday,
  eventOccursOnDate,
  getEventsForDate,
  getEventsForMonth,
  generateGoogleCalendarUrl,
  generateICalContent,
  generateShareableUrl,
  downloadICalFile,
  cn,
} from "./utils";

import {
  subscribeToNotifications,
  unsubscribeFromNotifications,
} from "./notifications";

function isMobile() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768;
}

export {
  AnimationVariants,
  cn,
  formatDate,
  formatTime,
  generateCalendarDays,
  isToday,
  matchesWeekday,
  eventOccursOnDate,
  getEventsForDate,
  getEventsForMonth,
  generateGoogleCalendarUrl,
  generateICalContent,
  generateShareableUrl,
  downloadICalFile,
  subscribeToNotifications,
  unsubscribeFromNotifications,
  isMobile,
};
