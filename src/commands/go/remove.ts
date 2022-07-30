import { Flags } from '@oclif/core';
import GoCommand from '../../go/go-command';

export default class Remove extends GoCommand {
  static description = 'remove a shortcut by name';

  static examples = [
    `$ bk go:remove <name>
remove the shortcut named <name>
`,
  ];

  static args = [{ name: 'name' }];

  static flags = {
    help: Flags.help({ char: 'h' }),
  };

  async run() {
    const { args } = await this.parse(Remove);
    if (args.name) {
      const data = await this.getData();
      if (data.shortcuts[args.name] ?? null) {
        delete data.shortcuts[args.name];
        await this.writeData(data);
        this.log(`Removed shortcut: ${args.name}`);
      }
    }
  }
}
