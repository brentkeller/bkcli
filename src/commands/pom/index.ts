import { Flags } from '@oclif/core';
import * as nodeNotifier from 'node-notifier';
import PomCommand from '../../modules/pom/pom-command';
import { PomSession } from '../../modules/pom/pom';
import { setInterval } from 'timers';
import sound = require('sound-play');
// Uses sound-play now, could try audic again
// but I was getting errors on first attempt

export default class Pom extends PomCommand {
  static description = 'start pomodoro sessions';

  static examples = [
    `$ bk pom
`,
  ];

  static args = [
    { name: 'session', description: 'length of the session in minutes', required: true },
    { name: 'break', description: 'length of the post-session break in minutes', required: true },
  ];

  static flags = {
    help: Flags.help({ char: 'h', description: 'show help for this command' }),
    task: Flags.string({
      char: 't',
      description: 'description of work being done in this session',
    }),
    category: Flags.string({
      char: 'c',
      description: 'name of category to group sessions together',
    }),
    quiet: Flags.boolean({
      char: 'q',
      description: 'quiet mode: no alert when the session or break end',
    }),
    noLog: Flags.boolean({
      char: 'n',
      description: "no log: don't persist this session after it ends",
    }),
    debug: Flags.boolean({
      char: 'd',
      description: 'debug mode: use 5 second session & break length for rapid testing',
    }),
  };

  currentTimer?: NodeJS.Timeout = undefined;
  resolveTimerPromise?: (value: unknown) => void = undefined;

  async run() {
    const { args, flags } = await this.parse(Pom);

    // Validate flags
    if (!args.session || args.session < 1) {
      this.error('Session length is required!');
    }
    if (!args.break || args.break < 1) {
      this.error('Break length is required!');
    }

    const session = new PomSession({
      sessionMins: parseInt(args.session, 10),
      breakMins: parseInt(args.break, 10),
      task: flags.task,
      category: flags.category,
      quiet: flags.quiet,
      noLog: flags.noLog,
      debug: flags.debug,
    });
    this.currentTimer = setInterval(this.processTick, 500, session, this);
    // Await a promise that will continue until our session ends
    // This avoids a timeout mechanism built in to oclif: https://github.com/oclif/core/issues/464
    await new Promise((resolve, _reject) => {
      this.resolveTimerPromise = resolve;
    });
  }

  async processTick(session: PomSession, self: Pom) {
    if (!self.currentTimer) return;
    const current = session.getProgress();
    // TODO: Change color of time output based on time remaining?
    self.writeUpdate(current.text);
    process.title = `${current.mode}: ${current.timeText}`;
    // TODO: Play 10% remaining warning sound?
    if (current.soundAlert) {
      // This seems to have a lag, probably because the sound isn't preloaded
      // perhaps another solution could be better?
      sound.play('C:\\files\\sounds\\shipbell.wav');
      // Notification banner
      // notify('Pomsole', 'Pomorodo session finished!');
    }

    if (!current.finished) return;
    clearInterval(self.currentTimer);
    self.writeUpdate('Session finished!');
    // TODO: Persist session info to log
    // const log = session.getLog();
    if (this.resolveTimerPromise != null) this.resolveTimerPromise(null);
  }

  notify(title: string, message: string) {
    // This works-ish, would rather have just a sound played tho
    const WindowsToaster = nodeNotifier.WindowsToaster;

    const notifier = new WindowsToaster({
      withFallback: false, // Fallback to Growl or Balloons?
    });

    notifier.notify(
      {
        title, // String. Required
        message, // String. Required if remove is not defined
        sound: true, // Bool | String (as defined by http://msdn.microsoft.com/en-us/library/windows/apps/hh761492.aspx)
        // icon: undefined, // String. Absolute path to Icon
        // id: undefined, // Number. ID to use for closing notification.
        // appID: undefined, // String. App.ID and app Name. Defaults to no value, causing SnoreToast text to be visible.
        // remove: undefined, // Number. Refer to previously created notification to close.
        // install: undefined // String (path, application, app id).  Creates a shortcut <path> in the start menu which point to the executable <application>, appID used for the notifications.
      },
      // function(error, response) {
      //   console.log(response);
      // }
    );
  }
}
