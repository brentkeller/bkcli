import { flags } from '@oclif/command';
import CommandBase from '../command-base';
import { writeJsonToFile } from '../util/file';

export default class Export extends CommandBase {
  static description = 'export all data';

  static examples = [
    `$ bk export <destination path>
export all data as json to the destination
`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  static args = [{ name: 'destination' }];

  async run() {
    const { args } = this.parse(Export);

    if ((args.destination?.length ?? 0) < 1) {
      this.error('Export destination is required!');
    }

    const data = await this.getData();
    await writeJsonToFile(args.destination, data);
    this.log(`Data exported to ${args.destination}`);
  }
}
