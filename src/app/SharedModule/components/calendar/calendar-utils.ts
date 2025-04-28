import {CalendarEndHour, CalendarStartHour} from "./calender-week/calender-week.component";

export class CalendarUtility {

  static getCorrectColumn(date: Date) {
    const dayOfTheWeek = date.getDay();
    return (dayOfTheWeek === 0) ? 8 : dayOfTheWeek + 1;
  }

  static getCorrectRow(date: Date) {
    const hourList = []
    for (let i = CalendarStartHour; i <= CalendarEndHour; i++) {
      hourList.push({hourNumber: i, displayName: ""});
    }
    const hours = (date.getHours() - hourList[0].hourNumber) * 12;
    const minutes = Math.floor(date.getMinutes() / 5);

    return hours + minutes + 2;
  }

}
