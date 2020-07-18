import Command from '../../command-base';

export default abstract class extends Command {
  async getData() {
    const data = await super.getData();
    if (!data.shortcuts) data.shortcuts = {};
    return data;
  }
}
