import { flags } from '@oclif/command';
import GoCommand from '../../go/go-command';

export default class List extends GoCommand {
  static description = 'list available shortcuts';

  static examples = [
    `$ bk go:list
list all shortcuts
`,
    `$ bk go:list -n st
list shortcuts whose name contains 'st'
`,
    `$ bk go:list -p dev
list shortcuts whose path contains 'dev'
`,
    `$ bk go:list -n st -p dev
list shortcuts whose name contains 'st' AND path contains 'dev'
`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
    // flag with a value (-n, --name=VALUE)
    name: flags.string({ char: 'n', description: 'shortcut name contains <NAME>' }),
    // flag with a value (-p, --path=VALUE)
    path: flags.string({ char: 'p', description: 'shortcut path contains <PATH>' }),
  };

  async run() {
    const { flags } = this.parse(List);

    const data = await this.getData();
    this.listShortcuts(data.shortcuts, flags);
  }
}
