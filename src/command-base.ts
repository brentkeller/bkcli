import Command from '@oclif/command';
import * as path from 'path';
import { getJsonFromFile, writeJsonToFile } from './util/file';

export default abstract class extends Command {
  dataFilePath = path.join(this.config.dataDir, 'data.json');

  async getData() {
    return getJsonFromFile(this.dataFilePath);
  }

  async writeData(data: any) {
    await writeJsonToFile(this.dataFilePath, data);
  }
}
