import { IsString } from 'class-validator';

export class AddStreamRuleDto {
  @IsString()
  value: string;

  @IsString()
  tag: string;
}
