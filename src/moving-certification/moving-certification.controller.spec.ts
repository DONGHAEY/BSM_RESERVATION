import { Test, TestingModule } from '@nestjs/testing';
import { MovingCertificationController } from './moving-certification.controller';

describe('MovingCertificationController', () => {
  let controller: MovingCertificationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovingCertificationController],
    }).compile();

    controller = module.get<MovingCertificationController>(
      MovingCertificationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
