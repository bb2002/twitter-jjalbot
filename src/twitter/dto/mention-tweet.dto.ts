import { IsArray, IsNumber, IsString } from 'class-validator';

export class MentionTweetMatchingRule {
  @IsNumber()
  id: string;

  @IsString()
  tag: string;
}

export class MentionTweet {
  @IsNumber()
  tweetId: string;

  @IsString()
  text: string;

  @IsArray()
  matchingRules: MentionTweetMatchingRule[];

  static make(raw) {
    const dto = new MentionTweet();
    dto.tweetId = raw.data.id;
    dto.text = raw.data.text;
    dto.matchingRules = raw.matching_rules?.map((value) => {
      const ruleDto = new MentionTweetMatchingRule();
      ruleDto.id = value.id;
      ruleDto.tag = value.tag;
      return ruleDto;
    });
    return dto;
  }
}
