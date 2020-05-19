import Command from '../command-base';
import * as fse from 'fs-extra';
import * as path from 'path';
import { cli } from 'cli-ux';
import { getShortcuts, Shortcuts } from './go';

export default abstract class extends Command {
  async getData() {
    const dataPath = path.join(this.config.dataDir, 'data.json');
    try {
      await fse.ensureFile(dataPath);
      const data = await fse.readJSON(dataPath);
      if (!data.shortcuts) data.shortcuts = {};
      return data;
    } catch (error) {
      this.log('error');
      return { shortcuts: {} };
    }
  }

  listShortcuts(dictionary: Shortcuts, flags: any) {
    const shortcuts = getShortcuts(dictionary);
    // TODO: Allow filtering by name or path?
    if (shortcuts.length === 0) {
      this.log('No shortcuts saved');
      return;
    }
    this.log('Available shortcuts:');
    cli.table(
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
