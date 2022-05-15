import { Logger, Module } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [],
  providers: [TwitterService, Logger],
  imports: [ScheduleModule.forRoot()],
})
export class TwitterModule {}
