import GoCommand from '../../go/go-command';

export default class Remove extends GoCommand {
  static description = 'remove a shortcut by name';

  static examples = [
    `$ bk go:remove <name>
remove the shortcut named <name>
`,
  ];

  static args = [{ name: 'name' }];

  async run() {
    const { args } = this.parse(Remove);
    if (args.name) {
      const data = await this.getData();
      if (data.shortcuts[args.name] ?? null) {
        delete data.shortcuts[args.name];
        await this.writeData(data);
        this.log(`Removed shortcut: ${args.name}`);
      }
    }
  }
}
