import { Flags } from '@oclif/core';
import BkcCommand from '../../bkc-command-base';

export default class Link extends BkcCommand {
  static description = 'link commands';

  static examples = [`$ bk link -u <url>`, `$ bk link -u <url> -t tag1,tag2`];

  static flags = {
    help: Flags.help({ char: 'h', description: 'show help for this command' }),
    url: Flags.string({
      char: 'u',
      description: 'url to save',
    }),
    tags: Flags.string({
      char: 't',
      description: 'comma-separated list of tags',
    }),
  };

  async run() {
    const { flags } = await this.parse(Link);

    // URL provided, save a link
    if (flags.url) {
      const data = {
        url: flags.url,
      } as any;
      if (flags.tags) data.tags = flags.tags.split(/[, ]/);
      const response = await this.mybkc?.makeRequest('/api/links', { method: 'POST', data });
      const link = await response?.data;
      this.log(`Added link ${link.title} (${link.url})`);
    }
  }
}
