import { Module } from '@nestjs/common';
import { JjalbotService } from './jjalbot.service';

@Module({
  providers: [JjalbotService],
  exports: [JjalbotService],
})
export class JjalbotModule {}
