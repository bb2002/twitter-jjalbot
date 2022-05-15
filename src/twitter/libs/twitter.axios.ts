import { AddStreamRuleDto } from '../dto/add-stream-rule.dto';
import { twitterAxios } from '../../common/libs/create-axios-instance';

export const addStreamRule = (rules: AddStreamRuleDto) =>
  twitterAxios().post('/tweets/search/stream/rules', {
    add: [rules],
  });
