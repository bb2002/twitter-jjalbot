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
}
// 주 명령어 타입을 추론하기 위한 문자 배열
export const JjalBotCommandMeta = {
  [JjalBotCommand.CMD_ADD]: ['register', '등록', '登録'],
};
export const JjalBotCommandArray = [JjalBotCommand.CMD_ADD];
/**
 * 옵션 추가하기
 * 1. enum 타입에 등록
 * 2. Meta 에 등록하면서 문자 배열 추가
 * 3. Array 에 등록
 */
// 명령어 옵션 타입
export enum JjalBotOptions {
  OPTION_UNKNOWN,
  OPTION_TAG,
}
// 명령어 옵션을 추론 하기 위한 문자 배열
export const JjalBotOptionsMeta = {
  [JjalBotOptions.OPTION_TAG]: ['--tag', '-t'],
};
export const JjalBotOptionsArray = [JjalBotOptions.OPTION_TAG];
