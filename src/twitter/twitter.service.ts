import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  addStreamRule,
  deleteStreamRules,
  getStreamRules,
  getTweetStream,
} from './libs/twitter.axios';

@Injectable()
export class TwitterService {
  INTERVAL_NAME = 'twitter-listener';
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @Inject(Logger)
    private readonly logger: LoggerService,
  ) {
    this.bootstrapService();
  }

  private bootstrapService() {
    this.resetTwitterStream()
      .then(() => {
        const interval = setInterval(
          this.listenTwitterMention.bind(this),
          1000,
        );
        this.schedulerRegistry.addInterval(this.INTERVAL_NAME, interval);
      })
      .catch((ex) => {
        this.logger.error('An error occurred TwitterService::bootstrapService');
        this.logger.error(ex.message);
      });
  }

  async listenTwitterMention() {
    this.schedulerRegistry.deleteInterval(this.INTERVAL_NAME);

    try {
      const res = await getTweetStream();
      console.log('res', res.data.data);
    } catch (ex) {
      this.logger.error(
        'An error occurred. TwitterService::listenTwitterMention',
      );
      this.logger.error(ex);
    } finally {
      // this.bootstrapService();
    }
  }

  async resetTwitterStream() {
    return true; // 일단 꺼둡니다.

    // 등록된 룰을 읽어온다.
    const res = await getStreamRules();
    const data = res.data.data as any[];

    // 룰을 모두 삭제한다.
    await deleteStreamRules(data.map((value) => value.id));

    // 새 룰을 등록합니다.
    await addStreamRule({
      value: process.env.TWITTER_STREAM_RULE_VALUE,
      tag: process.env.TWITTER_STREAM_RULE_TAG,
    });
    this.logger.log('Twitter stream rule registered successfully');
  }
}
