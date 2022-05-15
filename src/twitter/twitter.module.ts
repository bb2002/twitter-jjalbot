import { Module } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  controllers: [],
  providers: [TwitterService],
  imports: [ScheduleModule.forRoot()],
})
export class TwitterModule {}
