export class JjalBotCommandNotFoundException extends Error {
  constructor(inCmd) {
    super(`Unknown command ${inCmd}`);
  }
}
