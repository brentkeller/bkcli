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
    // TODO: implement config:mybkc delete
    delete: flags.string({ char: 'd', description: 'delete a profile' }),
    // TODO: implement config:mybkc list
    list: flags.boolean({ char: 'l', description: 'list available profiles' }),
    new: flags.boolean({ char: 'n', description: 'add a new profile' }),
    // TODO: implement config:mybkc refresh
    refresh: flags.string({ char: 'r', description: 'refresh authentication for a profile' }),
    current: flags.boolean({ char: 'c', description: 'show the current profile' }),
  };

  async run() {
    const { flags } = this.parse(MyBKCIndex);

    const mybkc = new MyBKC(this.config.dataDir);
    await mybkc.init();

    if (flags.new) {
      const newProfile = await mybkc.newProfile();
      this.log('new profile:');
      this.printProfile(newProfile);
    }

    if (flags.current) {
      const current = await mybkc.getProfile(mybkc.config.currentProfile);
      this.log('Current profile:');
      this.printProfile(current);
    }
  }

  printProfile(config: MyBKCProfile) {
    this.log(`Name: ${config.name}`);
    this.log(`Url: ${config.url}`);
  }
}
