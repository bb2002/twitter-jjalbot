import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import {
  addStreamRule,
  deleteStreamRules,
  getStreamRules,
  getTweetStream,
} from '../common/libs/twitter.axios';
import { MentionTweet } from './dto/mention-tweet.dto';
import { parseCommand } from '../jjalbot/libs/command-parser';
import { JjalbotService } from '../jjalbot/jjalbot.service';
import { JjalBotCommand, JjalBotIgnores } from './enums/jjalbot-command.enum';

@Injectable()
export class TwitterService {
  INTERVAL_NAME = 'twitter-listener';
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    @Inject(Logger)
    private readonly logger: LoggerService,
    private readonly jjalbotService: JjalbotService,
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
        this.logger.error(ex);
      });
  }

  private async resetTwitterStream() {
    // 등록된 룰을 읽어온다.
    const res = await getStreamRules();
    const data = res.data.data as any[];

    // 룰을 모두 삭제한다.
    if (data) {
      await deleteStreamRules(data.map((value) => value.id));
    }

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

    for (let line of lines) {
      line = line.trim();

      if (
        [
          ...JjalBotIgnores,
          ...(process.env.JJALBOT_IGNORE ?? '').split(','),
        ].indexOf(line) === -1
      ) {
        const command = parseCommand(line);

        if (command.isCommand) {
          switch (command.root.command) {
            case JjalBotCommand.CMD_ADD:
              await this.jjalbotService.addJjal(tweet, command);
              return;
            case JjalBotCommand.CMD_SEARCH:
              await this.jjalbotService.searchJjalWithOptions(tweet, command);
              return;
          }
        } else {
          await this.jjalbotService.searchJjalWithoutOptions(tweet, command);
          return;
        }
      }
    }
  }
}
