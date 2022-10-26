import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BsmOauthUserRole } from 'bsm-oauth';
import { Roles } from 'src/auth/decorator/roles.decorator';
import JwtAuthGuard from 'src/auth/guards/auth.guard';
import { levelGuard } from 'src/auth/guards/level.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RequestReservationDto } from 'src/room/dto/requestReservation.dto';
import { MovingCertificationService } from './moving-certification.service';

@Controller('moving-certification')
@UseGuards(JwtAuthGuard, levelGuard, RolesGuard)
export class MovingCertificationController {
  constructor(private certificationService: MovingCertificationService) {}

  /// 예약을 요청하는 API ///
  @Post('/request')
  @Roles(BsmOauthUserRole.STUDENT)
  async requestToTeacher(@Body() requestReservationDto: RequestReservationDto) {
    return await this.certificationService.requestRoom(requestReservationDto);
    // 학생이 이석 요청을 한다, 이 API를 사용한다.
  }

  /// 예약을 승인 및 거부하는 API ///
  @Post('/response')
  @Roles(BsmOauthUserRole.TEACHER)
  async responseToStudents(@Body() responseReservationDto) {
    // 선생님이 학생의 요청을 보고 응답을 한다, 이 API를 사용한다.
    // 1. 선생님이 학생에게 승인, 거부를 할 수 있다.
    // 2. 요청을 응답하는 선생님이 그 요청 사항에 기록된 요청된 선생님 정보와 일치하는지 확인한다.
    // 3. 요청을 거부 및 승인한다. (DB에 응답사항을 업데이트한다.)
  }
}
