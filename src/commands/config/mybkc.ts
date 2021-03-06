import { flags } from '@oclif/command';
import CommandBase from '../../command-base';
import { MyBKC, MyBKCProfile } from '../../util/mybkc';

export default class MyBKCIndex extends CommandBase {
  static description = 'manage config for my.brentkeller.com connection';

  static examples = [
    `$ bk config:mybkc
TODO: Document this
`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    delete: flags.string({ char: 'd', description: 'delete a profile' }),
    list: flags.boolean({ char: 'l', description: 'list available profiles' }),
    new: flags.boolean({ char: 'n', description: 'add a new profile' }),
    // TODO: implement config:mybkc refresh
    refresh: flags.string({ char: 'r', description: 'refresh authentication for a profile' }),
    current: flags.boolean({ char: 'c', description: 'show the current profile' }),
    set: flags.string({ char: 's', description: 'set the current profile' }),
  };

  mybkc?: MyBKC;

  async run() {
    const { flags } = this.parse(MyBKCIndex);

    this.mybkc = new MyBKC(this.config.dataDir);
    await this.mybkc.init();

    if (flags.new) {
      const newProfile = await this.mybkc.newProfile();
      await this.mybkc.setCurrentProfile(newProfile);
      this.log('new profile:');
      this.printProfile(newProfile);
    }

    if (flags.current) {
      await this.showCurrentProfile();
    }

    if (flags.delete) {
      const removed = await this.mybkc.removeProfile(flags.delete);
      const message = removed
        ? `Removed profile '${flags.delete}'`
        : `Profile '${flags.delete}' not deleted!`;
      this.log(message);
    }

    if (flags.list) {
      this.log('Saved profiles:');
      this.log('');
      for (const key in this.mybkc.config.profiles) {
        if ({}.hasOwnProperty.call(this.mybkc.config.profiles, key)) {
          const profile = this.mybkc.config.profiles[key];
          this.printProfile(profile);
        }
      }
    }

    if (flags.set) {
      const profile = await this.mybkc.getProfile(flags.set);
      if (profile) {
        await this.mybkc.setCurrentProfile(profile);
        await this.showCurrentProfile();
      }
    }
  }

  async showCurrentProfile() {
    const current = await this.mybkc?.getProfile(this.mybkc.config.currentProfile);
    this.log('Current profile:');
    this.printProfile(current);
  }

  printProfile(config?: MyBKCProfile) {
    if (!config) return;
    this.log(`Name: ${config.name}`);
    this.log(`Url: ${config.url}`);
    this.log('');
  }
}
