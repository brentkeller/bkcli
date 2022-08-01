import Command from '../command-base';
import {CliUx} from '@oclif/core';
import { getShortcuts, Shortcuts } from './go';

export default abstract class extends Command {
  async getData() {
    const data = await super.getData();
    if (!data.shortcuts) data.shortcuts = {};
    return data;
  }

  listShortcuts(dictionary: Shortcuts, flags?: any) {
    let shortcuts = getShortcuts(dictionary);
    if (flags?.name) {
      shortcuts = shortcuts.filter(s => s.name.includes(flags.name));
    }
    if (flags?.path) {
      shortcuts = shortcuts.filter(s => s.path.includes(flags.path));
    }
    if (shortcuts.length === 0) {
      this.log('No shortcuts found');
      return;
    }
    this.log('Available shortcuts:');
    CliUx.ux.table(
      shortcuts,
      {
        name: {
          get: row => row.name,
          minWidth: 7,
        },
        path: {
          get: row => row.path,
        },
      },
      {
        printLine: this.log,
        ...flags, // parsed flags
      },
    );
  }
}
