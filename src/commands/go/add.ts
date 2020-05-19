import { flags } from '@oclif/command';
import GoCommand from '../../go/go-command';

export default class Add extends GoCommand {
  static description = 'create a shortcut';

  static examples = [
    `$ bk go:add <name>
go to shortcut named <name>
`,
    `$ bk go:add <name> <path>
go to shortcut named <name> to the path <path>
`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  static args = [{ name: 'name' }, { name: 'path' }];

  async run() {
    const { args } = this.parse(Add);

    if (args.name) {
      const data = await this.getData();
      // Use the provided path, with a fallback to the current working directory
      const shortcutPath = args.path ?? process.cwd();
      data.shortcuts[args.name] = shortcutPath;
      await this.writeData(data);
      this.log(`added ${args.name}: ${shortcutPath}`);
    }
  }
}
