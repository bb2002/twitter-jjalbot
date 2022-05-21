import {
  JjalBotCommand,
  JjalBotCommandArray,
  JjalBotCommandMeta,
  JjalBotOptions,
  JjalBotOptionsArray,
  JjalBotOptionsMeta,
} from 'src/twitter/enums/jjalbot-command.enum';
import {
  CommandArgs,
  CommandObject,
  RootCommandArg,
} from '../../../twitter/dto/command.dto';
import { JjalBotCommandNotFoundException } from './jjalbot-cmd-parser.exceptions';

export function parseCommand(line: string) {
  const commandObject = new CommandObject();
  commandObject.isCommand = line.startsWith('!');
  commandObject.payload = line.replace('!', '').trim();

  if (!commandObject.isCommand) {
    return commandObject;
  }

  const chunk = commandObject.payload.split(' ');
  {
    const root = new RootCommandArg();

    // 사용자가 입력한 명령어
    const cmdOfStr = chunk[0];
    for (const cmd of JjalBotCommandArray) {
      if (JjalBotCommandMeta[cmd].indexOf(cmdOfStr) !== -1) {
        root.command = cmd;
      }
    }
    commandObject.root = root;
  }

  // 명령어를 찾을 수 없는 경우
  if (commandObject.root.command === JjalBotCommand.CMD_UNKNOWN) {
    throw new JjalBotCommandNotFoundException(chunk[0]);
  }

  {
    const validation = (argObj: CommandArgs) =>
      argObj && argObj.option !== JjalBotOptions.OPTION_UNKNOWN;

    let argObj: CommandArgs;
    for (const c of chunk) {
      if (c.startsWith('--') || c.startsWith('-')) {
        if (validation(argObj)) {
          // 제대로 된 명령어가 하나 만들어진 경우 해당 명령어를 최종적으로 등록
          commandObject.root.args.push(argObj);
        }

        argObj = new CommandArgs();

        for (const option of JjalBotOptionsArray) {
          if (JjalBotOptionsMeta[option].indexOf(c) !== -1) {
            argObj.option = option;
          }
        }
      } else {
        if (argObj && argObj.option !== JjalBotOptions.OPTION_UNKNOWN) {
          argObj.data.push(c);
        }
      }
    }

    if (validation(argObj)) {
      // 마지막 명령어가 됨
      commandObject.root.args.push(argObj);
    }
  }

  return commandObject;
}
