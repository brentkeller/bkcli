import Command from '../../command-base';
import { MyBKC } from '../../util/mybkc';

export default abstract class extends Command {
  mybkc: MyBKC | undefined;

  async init() {
    this.mybkc = new MyBKC(this.config.dataDir);
    await this.mybkc.init();
  }

  async getData() {
    const data = await super.getData();
    if (!data.shortcuts) data.shortcuts = {};
    return data;
  }
}
