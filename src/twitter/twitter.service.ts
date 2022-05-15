import { Inject, Injectable } from '@nestjs/common';
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { WINSTON_MODULE_PROVIDER, WinstonLogger } from 'nest-winston';

@Injectable()
export class TwitterService {
  INTERVAL_NAME = 'twitter-listener';
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
  ) {
    this.bootstrapService();
  }

  private bootstrapService() {
    const interval = setInterval(this.listenTwitterMention.bind(this), 100);
    this.schedulerRegistry.addInterval(this.INTERVAL_NAME, interval);
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
      this.bootstrapService();
    }
  }
}
