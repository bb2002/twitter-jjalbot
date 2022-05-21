import { Logger, Module } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { ScheduleModule } from '@nestjs/schedule';
import { JjalbotModule } from '../jjalbot/jjalbot.module';

@Module({
  controllers: [],
  providers: [TwitterService, Logger],
  imports: [ScheduleModule.forRoot(), JjalbotModule],
})
export class TwitterModule {}
