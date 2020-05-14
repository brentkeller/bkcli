import { flags } from '@oclif/command';
import Command from '../../command-base';

export default class Remove extends Command {
  static description = 'remove a shortcut by name';

  static examples = [
    `$ bk go:remove <name>
remove the shortcut named <name>
`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'name to print' }),
    // flag with no value (-f, --force)
    force: flags.boolean({ char: 'f' }),
  };

  static args = [{ name: 'name' }];

  async run() {
    const { args } = this.parse(Remove);

    // TODO: Validate name
    if (args.name) {
      const data = await this.getData();
      if (!data.shortcuts) data.shortcuts = {};
      if (data.shortcuts[args.name] ?? null) {
        delete data.shortcuts[args.name];
        await this.writeData(data);
        this.log(`Removed shortcut: ${args.name}`);
      }
    }
  }
}
