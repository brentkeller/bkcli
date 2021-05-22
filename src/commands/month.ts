import { flags } from '@oclif/command';
import * as clipboardy from 'clipboardy';
import {
  format,
  endOfMonth,
  addDays,
  isWednesday,
  isFriday,
  isWeekend,
  isThursday,
  isTuesday,
  differenceInCalendarDays,
} from 'date-fns';
import CommandBase from '../command-base';

export default class Month extends CommandBase {
  static description = 'generate populated monthly journal template, copied to clipboard';

  static examples = [
    `$ bk month <month> <year>
generate the daily entries for the given month`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  static args = [
    { name: 'month', description: 'name of the month', required: true },
    { name: 'year', description: 'the year to use, defaults to current year' },
  ];

  output = '';

  async run() {
    const { args } = this.parse(Month);
    const month = this.getMonth(args.month);
    if (month < 0) this.error('Invalid month!');
    const year = args.year ?? new Date().getFullYear();

    let date = new Date(year, month, 1, 0, 0, 0);
    const endDate = endOfMonth(date);

    while (date < endDate) {
      this.writeLine(this.dateLabel(date));
      this.getTasks(date, endDate);
      date = addDays(date, 1);
    }
    this.log(this.output);
    clipboardy.writeSync(this.output);
  }

  getMonth(month: string) {
    return [
      'jan',
      'feb',
      'mar',
      'apr',
      'may',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'dec',
    ].indexOf(month);
  }

  dateLabel(date: Date) {
    return format(date, 'ccc MMM d');
  }

  writeLine(text: string) {
    this.output += text + '\n';
  }

  getTasks(date: Date, endDate: Date) {
    if (isTuesday(date) && differenceInCalendarDays(endDate, date) < 7)
      this.writeLine(' Secfuesday');
    if (this.isSchoolDay(date)) this.writeLine(' 8:35a Meli school bus');
    if (isFriday(date)) this.writeLine(' 9a Write up weekly progress');
    if (isFriday(date)) this.writeLine(' 11a Weekly meeting');
    if (isWednesday(date)) this.writeLine(' 11a Sprint check-in');
    if (this.isSchoolDay(date)) this.writeLine(' 3:50p Meli school bus');
    if (this.isBowlingDay(date)) this.writeLine(' 7p Bowling');
    if (isWednesday(date)) this.writeLine(' 9p Trash');
  }

  isSchoolDay(date: Date) {
    return !isWeekend(date) && !(date.getMonth() >= 5 && date.getMonth() <= 7);
  }

  isBowlingDay(date: Date) {
    return isThursday(date) && !(date.getMonth() >= 5 && date.getMonth() <= 7);
  }
}
