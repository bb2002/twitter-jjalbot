/**
 * 주 명령어 추가하기
 * 1. enum 타입에 등록
 * 2. Meta 에 등록하면서 문자 배열 추가
 * 3. Array 에 등록
 */
// 주 명령어 타입
export enum JjalBotCommand {
  CMD_UNKNOWN,
  CMD_ADD,
  CMD_SEARCH,
}
// 주 명령어 타입을 추론하기 위한 문자 배열
export const JjalBotCommandMeta = {
  [JjalBotCommand.CMD_ADD]: ['add', '등록', '登録'],
  [JjalBotCommand.CMD_SEARCH]: ['search', '검색', '検索'],
};
export const JjalBotCommandArray = [
  JjalBotCommand.CMD_ADD,
  JjalBotCommand.CMD_SEARCH,
];
/**
 * 옵션 추가하기
 * 1. enum 타입에 등록
 * 2. Meta 에 등록하면서 문자 배열 추가
 * 3. Array 에 등록
 */
// 명령어 옵션 타입
export enum JjalBotOptions {
  OPTION_UNKNOWN,
  OPTION_TITLE,
  OPTION_TAG,
  OPTION_EXACT,
}
// 명령어 옵션을 추론 하기 위한 문자 배열
export const JjalBotOptionsMeta = {
  [JjalBotOptions.OPTION_TITLE]: ['--title', '-tl'],
  [JjalBotOptions.OPTION_TAG]: ['--tag', '-tg'],
  [JjalBotOptions.OPTION_EXACT]: ['--exact', '-ex'],
};
export const JjalBotOptionsArray = [JjalBotOptions.OPTION_TITLE];

export const JjalBotIgnores = ['\r', '\t', ''];
