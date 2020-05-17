import { flags } from '@oclif/command';
import { cli } from 'cli-ux';
import Command from '../../command-base';

export default class Go extends Command {
  static description = 'create shortcuts and jump to directories by name';

  static examples = [
    `$ bk go <name>
go to shortcut named 'name'
`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  static args = [{ name: 'name' }];

  async run() {
    const { args } = this.parse(Go);

    const data = await this.getData();
    if (!data.shortcuts) data.shortcuts = {};
    if (args.name) {
      const shortcutPath = data.shortcuts[args.name];
      // See if we have a valid shortcut
      if (shortcutPath?.length > 0) {
        // Log out the shortcut destination for the shell script to use
        this.log(shortcutPath);
      }
    } else {
      this.listShortcuts(data);
    }
  }

  listShortcuts(data: any) {
    const entries = Object.entries(data.shortcuts);
    if (entries.length === 0) {
      this.log('No shortcuts saved');
      return;
    }
    this.log('Available shortcuts:');
    cli.table(
      entries,
      {
        name: {
          get: row => row[0],
          minWidth: 7,
        },
        path: {
          get: row => row[1],
        },
      },
      {
        printLine: this.log,
        ...flags, // parsed flags
      },
    );
  }
}
