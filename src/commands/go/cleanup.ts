import { Flags } from '@oclif/core';
import { getShortcuts } from '../../go/go';
import GoCommand from '../../go/go-command';
import { fileExists } from '../../util/file';

export default class Cleanup extends GoCommand {
  static description = 'cleanup invalid shortcuts';

  static examples = [
    `$ bk go:cleanup
cleanup invalid shortcuts
`,
    `$ bk go:list -s
list invalid shortcuts with removing
`,
  ];

  static flags = {
    help: Flags.help({ char: 'h' }),
    safe: Flags.boolean({
      char: 's',
      description: 'Safe mode: list invalid shortcuts without removing',
    }),
  };

  async run() {
    const { flags } = await this.parse(Cleanup);

    const data = await this.getData();
    const shortcuts = getShortcuts(data.shortcuts);
    let allShortcutsValid = true;
    shortcuts.forEach(s => {
      if (fileExists(s.path)) return;
      allShortcutsValid = false;
      if (flags.safe) {
        this.log(`Found invalid shortcut "${s.name}" (${s.path})`);
      } else {
        delete data.shortcuts[s.name];
        this.log(`Removed invalid shortcut "${s.name}" (${s.path})`);
      }
    });
    if (allShortcutsValid) this.log('All shortcuts are valid!');
    else if (!flags.safe) await this.writeData(data);
  }
}
