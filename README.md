bkcli
=====

Helpful personal CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/bkcli.svg)](https://npmjs.org/package/bkcli)
[![Downloads/week](https://img.shields.io/npm/dw/bkcli.svg)](https://npmjs.org/package/bkcli)
[![License](https://img.shields.io/npm/l/bkcli.svg)](https://github.com/brentkeller/bkcli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g bkcli
$ bk COMMAND
running command...
$ bk (-v|--version|version)
bkcli/0.0.0 win32-x64 node-v12.14.0
$ bk --help [COMMAND]
USAGE
  $ bk COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bk go [FILE]`](#bk-go-file)
* [`bk hello [FILE]`](#bk-hello-file)
* [`bk help [COMMAND]`](#bk-help-command)

## `bk go [FILE]`

describe the command here

```
USAGE
  $ bk go [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src\commands\go.ts](https://github.com/brentkeller/bkcli/blob/v0.0.0/src\commands\go.ts)_

## `bk hello [FILE]`

describe the command here

```
USAGE
  $ bk hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ bk hello
  hello world from ./src/hello.ts!
```

_See code: [src\commands\hello.ts](https://github.com/brentkeller/bkcli/blob/v0.0.0/src\commands\hello.ts)_

## `bk help [COMMAND]`

display help for bk

```
USAGE
  $ bk help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.0.0/src\commands\help.ts)_
<!-- commandsstop -->
