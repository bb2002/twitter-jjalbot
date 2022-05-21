import { Test, TestingModule } from '@nestjs/testing';
import { JjalbotService } from './jjalbot.service';

describe('JjalbotService', () => {
  let service: JjalbotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JjalbotService],
    }).compile();

    service = module.get<JjalbotService>(JjalbotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
