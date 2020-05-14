import Command from '@oclif/command';
import * as fse from 'fs-extra';
import * as path from 'path';

export default abstract class extends Command {
  async getData() {
    const dataPath = path.join(this.config.dataDir, 'data.json');
    try {
      await fse.ensureFile(dataPath);
      return await fse.readJSON(dataPath);
    } catch (error) {
      this.log('error');
      return {};
    }
  }

  async writeData(data: any) {
    await fse.writeJSON(path.join(this.config.dataDir, 'data.json'), data);
  }
}
