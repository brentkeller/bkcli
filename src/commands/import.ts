import { Flags } from '@oclif/core';
import CommandBase from '../command-base';
import { getJsonFromFile, fileExists } from '../util/file';

export default class Import extends CommandBase {
  static description = 'import data';

  static examples = [
    `$ bk import <source file path>
import all data from the source file
`,
  ];

  static flags = {
    help: Flags.help({ char: 'h' }),
  };

  static args = [{ name: 'source' }];

  async run() {
    const { args } = await this.parse(Import);

    if ((args.source?.length ?? 0) < 1) this.error('Import source is required!');

    if (!fileExists(args.source)) this.error('Import source file not found!');

    const data = await getJsonFromFile(args.source);
    await this.writeData(data);
    this.log(`Data imported from ${args.source}`);
  }
}
