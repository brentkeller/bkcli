import { flags } from '@oclif/command';
import { cli } from 'cli-ux';
import Command from '../../command-base';

/*
Requires a shell-level script to navigate the working directory to the shortcut.

Installation:

PowerShell
TODO: Add goto.ps1 content here?
1. Create a script (see c:\dev\scripts\goto.ps1)
2. Add the script with an alias to the user's profile:
- C:\Users\brent\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1
or 
- C:\Users\brent\Documents\WindowsPowerShell\profile.ps1
2a.
    # GO (requires bkcli installed or linked (npm link))
    function Go-To-Shortcut { c:\dev\scripts\goto.ps1 $args }
    Set-Alias go Go-To-Shortcut
3. Use the shortcut: `go <shortcut name>` (e.g. `go dev`)

*/

export default class Go extends Command {
  static description = 'create shortcuts and jump to directories by name';

  static examples = [
    `$ bk go <name>
go to shortcut named 'name'
`,
  ];

  static flags = {
    help: flags.help({ char: 'h' }),
  };

  static args = [{ name: 'name' }];

  async run() {
    const { args } = this.parse(Go);

    const data = await this.getData();
    if (!data.shortcuts) data.shortcuts = {};
    if (args.name) {
      const shortcutPath = data.shortcuts[args.name];
      // See if we have a valid shortcut
      if (shortcutPath?.length > 0) {
        // Log out the shortcut destination for the shell script to use
        this.log(shortcutPath);
      }
    } else {
      this.listShortcuts(data);
    }
  }

  listShortcuts(data: any) {
    const entries = Object.entries(data.shortcuts);
    // TODO: Alphabetize by shortcut name
    // TODO: Allow filtering by name or path?
    if (entries.length === 0) {
      this.log('No shortcuts saved');
      return;
    }
    this.log('Available shortcuts:');
    cli.table(
      entries,
      {
        name: {
          get: row => row[0],
          minWidth: 7,
        },
        path: {
          get: row => row[1],
        },
      },
      {
        printLine: this.log,
        ...flags, // parsed flags
      },
    );
  }
}
