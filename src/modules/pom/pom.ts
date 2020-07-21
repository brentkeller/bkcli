import { add, differenceInMinutes, differenceInSeconds } from 'date-fns';

export interface SessionConfig {
  sessionMins: number;
  breakMins: number;
  task?: string;
  category?: string;
  quiet?: boolean;
  noLog?: boolean;
  debug?: boolean;
}

interface SessionProgress {
  text: string;
  mode: string;
  remainingMins: number;
  remainingSecs: number;
  soundAlert: boolean;
  finished: boolean;
}

interface SessionLog {
  start: Date;
  task?: string;
  category?: string;
  sessionLength: number;
  breakLength: number;
}

export class PomSession {
  start: Date;

  end: Date;

  task?: string;

  category?: string;

  sessionLength: number;

  breakLength: number;

  quiet = false;

  logSession = true;

  debug = false;

  currentMode: 'session' | 'break' = 'session';

  constructor(config: SessionConfig) {
    this.start = new Date();
    this.end = add(this.start, { minutes: config.sessionMins });
    if (config.debug) {
      this.debug = true;
      this.end = add(this.start, { seconds: 5 });
    }
    this.sessionLength = config.sessionMins;
    this.breakLength = config.breakMins;
    this.task = config.task;
    this.category = config.category;
    if (config.quiet) this.quiet = config.quiet;
    this.logSession = !config.noLog;
  }

  getProgress(): SessionProgress {
    const currentTime = new Date();
    const remainingMins = differenceInMinutes(this.end, currentTime);
    const remainingSecs = differenceInSeconds(this.end, currentTime) % 60;

    const label = this.currentMode === 'session' ? 'Session' : 'Break';
    const text = `${label} remaining: ${remainingMins}:${remainingSecs
      .toString()
      .padStart(2, '0')}`;
    const soundAlert = !this.quiet && remainingMins === 0 && remainingSecs === 0;
    const finished = this.currentMode === 'break' && remainingMins === 0 && remainingSecs === 0;
    const result = {
      text,
      remainingMins,
      remainingSecs,
      soundAlert,
      finished,
      mode: this.currentMode,
    } as SessionProgress;
    if (this.currentMode === 'session' && remainingMins === 0 && remainingSecs === 0) {
      this.end = add(new Date(), { minutes: this.breakLength });
      if (this.debug) this.end = add(new Date(), { seconds: 5 });
      this.currentMode = 'break';
    }
    return result;
  }

  getLog() {
    return {
      start: this.start,
      task: this.task,
      category: this.category,
      sessionLength: this.sessionLength,
      breakLength: this.breakLength,
    } as SessionLog;
  }
}
