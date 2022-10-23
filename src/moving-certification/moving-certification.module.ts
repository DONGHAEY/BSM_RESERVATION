import { Module } from '@nestjs/common';
import { MovingCertificationService } from './moving-certification.service';

@Module({
  providers: [MovingCertificationService]
})
export class MovingCertificationModule {}
