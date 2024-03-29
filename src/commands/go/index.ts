import { Flags } from '@oclif/core';
import GoCommand from '../../go/go-command';

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

export default class Go extends GoCommand {
  static description = 'manage working directory shortcuts';

  static examples = [
    `$ bk go <name>
prints the path for the shortcut named 'name'
Should be used by a shell script to make navigation shortcuts
`,
  ];

  static flags = {
    help: Flags.help({ char: 'h' }),
  };

  static args = [{ name: 'name' }];

  async run() {
    const { args } = await this.parse(Go);

    const data = await this.getData();
    if (args.name) {
      const shortcutPath = data.shortcuts[args.name];
      // See if we have a valid shortcut
      if (shortcutPath?.length > 0) {
        // Log out the shortcut destination for the shell script to use
        this.log(shortcutPath);
      } else {
        // Log out the current directory to not move anywhere
        this.log('.');
      }
    } else {
      this.listShortcuts(data.shortcuts);
    }
  }
}
