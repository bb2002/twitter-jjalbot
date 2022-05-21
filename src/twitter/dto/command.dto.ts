import { IsArray, IsBoolean, IsEnum, IsObject, IsString } from 'class-validator';
import { JjalBotCommand, JjalBotOptions } from '../enums/jjalbot-command.enum';

export class CommandArgs {
  @IsEnum(JjalBotOptions)
  option: JjalBotOptions = JjalBotOptions.OPTION_UNKNOWN;

  @IsArray()
  data: string[] = [];
}

export class RootCommandArg {
  @IsEnum(JjalBotCommand)
  command: JjalBotCommand = JjalBotCommand.CMD_UNKNOWN;

  @IsArray()
  args: CommandArgs[] = [];
}

export class CommandObject {
  @IsBoolean()
  isCommand: boolean;

  @IsString()
  payload: string;

  @IsObject()
  root: RootCommandArg;
}
