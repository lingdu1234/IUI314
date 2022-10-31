/* eslint-disable no-unused-vars */
export enum CronType {
  SECOND,
  MINUTE,
  HOUR,
  DAY,
  MONTH,
  WEEK,
  YEAR,
}

export enum DayGroup {
  EVERY,
  CYCLE,
  INTERVAL,
  FIX,
  FIX_MONTH_WEEK,
  CLOSEST_WORKDAY,
  LAST_DAY,
  LAST_WEEK_DAY,
  NOT_SPECIFY,
  NONE,
}

export enum WeekEnum {
  SUNDAY = 1,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
}
