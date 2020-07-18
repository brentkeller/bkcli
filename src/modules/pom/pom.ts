import { add, differenceInMinutes, differenceInSeconds } from 'date-fns';

export interface SessionConfig {
  sessionMins: number;
  breakMins: number;
  task?: string;
  category?: string;
  quiet?: boolean;
  noLog?: boolean;
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

  currentMode: 'session' | 'break' = 'session';

  constructor(config: SessionConfig) {
    this.start = new Date();
    // this.end = add(this.start, { minutes: config.sessionMins });
    // Debug timing
    this.end = add(this.start, { seconds: 5 });
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
    const remainingSecs = differenceInSeconds(this.end, currentTime);

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
      // Debug break timer
      this.end = add(new Date(), { seconds: 5 });
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

/*
public class SessionConfig
    {
        /// <summary>
        /// Length of session in minutes
        /// </summary>
        public int SessionLength { get; set; }
        /// <summary>
        /// Length of break in minutes
        /// </summary>
        public int BreakLength { get; set; }
        /// <summary>
        /// Name of task category
        /// </summary>
        public string Category { get; set; }
        /// <summary>
        /// Name of task being worked on
        /// </summary>
        public string Task { get; set; }
        /// <summary>
        /// Flag to silence alert sound
        /// </summary>
        public bool Quiet { get; set; }

        public override string ToString()
        {
            var output = new StringBuilder();
            output.AppendLine($"Session: {SessionLength}");
            output.AppendLine($"Break: {BreakLength}");
            output.AppendLine($"Category: {Category}");
            output.AppendLine($"Task: {Task}");
            output.AppendLine($"Quiet: {Quiet}");
            return output.ToString();
        }
    }
*/
