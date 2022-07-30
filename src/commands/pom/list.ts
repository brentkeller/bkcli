import { flags } from '@oclif/command';
import PomCommand from '../../modules/pom/pom-command';
import { FetchParams } from '../../util/mybkc';

export default class PomList extends PomCommand {
  static description = 'start pomodoro sessions';

  static examples = [
    `$ bk pom:list
`,
  ];

  static args = [
    { name: 'session', description: 'length of the session in minutes', required: true },
    { name: 'break', description: 'length of the post-session break in minutes', required: true },
  ];

  static flags = {
    help: flags.help({ char: 'h', description: 'show help for this command' }),
  };

  async run() {
    // const { args, flags } = this.parse(PomList);

    const response = await this.mybkc?.makeRequest('/api/pomodoro', {
      method: 'get',
    } as FetchParams);
    const poms = await response?.data;
    this.log(poms);
  }
}
