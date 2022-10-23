import { Test, TestingModule } from '@nestjs/testing';
import { MovingCertificationService } from './moving-certification.service';

describe('MovingCertificationService', () => {
  let service: MovingCertificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MovingCertificationService],
    }).compile();

    service = module.get<MovingCertificationService>(MovingCertificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
