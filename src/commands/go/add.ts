import { Flags } from '@oclif/core';
import GoCommand from '../../go/go-command';

export default class Add extends GoCommand {
  static description = 'create a shortcut';

  static examples = [
    `$ bk go:add <name>
add a shortcut named <name> pointing to the current directory
`,
    `$ bk go:add <name> <path>
add a shortcut named <name> pointing to the <path> directory
    `,
  ];

  static flags = {
    help: Flags.help({ char: 'h' }),
  };

  static args = [{ name: 'name' }, { name: 'path' }];

  async run() {
    const { args } = await this.parse(Add);

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
