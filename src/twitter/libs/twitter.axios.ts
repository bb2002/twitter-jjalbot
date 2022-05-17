import { AddStreamRuleDto } from '../dto/add-stream-rule.dto';
import { twitterAxios } from '../../common/libs/create-axios-instance';
import request from 'request';

export const addStreamRule = (rules: AddStreamRuleDto) =>
  twitterAxios().post('/tweets/search/stream/rules', {
    add: [rules],
  });

export const getStreamRules = () =>
  twitterAxios().get('/tweets/search/stream/rules');

export const deleteStreamRules = (ids: string[]) =>
  twitterAxios().post('/tweets/search/stream/rules', {
    delete: {
      ids: ids,
    },
  });

export const getTweetStream = () =>
  twitterAxios().get('/tweets/search/stream', {
    responseType: 'stream',
  });
