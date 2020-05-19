import Command from '../command-base';
import * as fse from 'fs-extra';
import * as path from 'path';
import { cli } from 'cli-ux';

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
}
