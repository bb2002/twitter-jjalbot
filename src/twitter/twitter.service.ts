import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { addStreamRule } from './libs/twitter.axios';

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
    const fetch = async () => {
      // TODO
      // 등록된 모든 룰을 삭제한다.

      // 새 룰을 등록합니다.
      await addStreamRule({
        value: process.env.TWITTER_STREAM_RULE_VALUE,
        tag: process.env.TWITTER_STREAM_RULE_TAG,
      });
      this.logger.log('Twitter stream rule registered successfully');
    };

    fetch()
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
      // TODO
      // Twitter API Stream 을 통해 내가 Mention 된 트윗을
      // 읽어오도록 한다.

      this.logger.warn('Mention 된 트윗 읽었다!!!!');
      this.logger.error('오류가 발생헀다고 가정');
    } catch (ex) {
      this.logger.error(
        'An error occurred. TwitterService::listenTwitterMention',
      );
      this.logger.error(ex);
    } finally {
      // this.bootstrapService();
    }
  }
}
