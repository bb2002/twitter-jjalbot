import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  addStreamRule,
  deleteStreamRules,
  getStreamRules,
  getTweetStream,
} from './libs/twitter.axios';
import { MentionTweet } from './dto/mention-tweet.dto';
import { parseCommand } from '../common/libs/jjalbot-cmd/command-parser';

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

  private async resetTwitterStream() {
    return true;

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

  async listenTwitterMention() {
    this.schedulerRegistry.deleteInterval(this.INTERVAL_NAME);

    try {
      const response = await getTweetStream();
      const stream = response.data;

      stream.on('data', async (data) => {
        const str = data.toString();
        if (str) {
          let dto: MentionTweet;
          try {
            // JSON Parse 에는 오류가 발생 할 수 있으므로 조치한다.
            dto = MentionTweet.make(JSON.parse(str));
          } catch (ex) {
            return;
          }

          await this.onMentionTweetHandler(dto);
        }
      });

      stream.on('end', () => {
        this.logger.warn('Stream closed. Try again.');
        this.bootstrapService();
      });
    } catch (ex) {
      this.logger.error(
        'An error occurred. TwitterService::listenTwitterMention',
      );
      this.logger.error(ex);
      this.bootstrapService();
    }
  }

  private async onMentionTweetHandler(tweet: MentionTweet) {
    const lines = tweet.text.split('\n');
    const commands = lines.map((value) => parseCommand(value));

    console.log(commands);
  }
}
