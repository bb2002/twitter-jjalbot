import { IsBoolean, IsString } from 'class-validator';

export class CommandDto {
  @IsBoolean()
  isCommand: boolean;

  @IsString()
  payload: string;

  static make(line: string) {
    const dto = new CommandDto();
    dto.isCommand = line.startsWith('!');
    dto.payload = line.replace('!', '').trim();
    return dto;
  }
}
