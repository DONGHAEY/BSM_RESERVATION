import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { BsmOauthUserRole } from 'bsm-oauth';
import { Request } from 'express';
import { Roles } from 'src/auth/decorator/roles.decorator';
import JwtAuthGuard from 'src/auth/guards/auth.guard';
import { levelGuard } from 'src/auth/guards/level.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RequestReservationDto } from './dto/requestReservation.dto';
import { ResponseReservationDto } from 'src/moving-certification/dto/responseReservation.dto';
import { TeacherInfo } from 'src/user/entity/TeacherInfo.entity';
import { MovingCertificationService } from './moving-certification.service';

@Controller('moving-certification')
@UseGuards(JwtAuthGuard, levelGuard, RolesGuard)
export class MovingCertificationController {
  constructor(private certificationService: MovingCertificationService) {}

  /// 예약을 요청하는 API ///
  @Post('/request')
  @Roles(BsmOauthUserRole.STUDENT)
  async requestToTeacher(@Body() requestReservationDto: RequestReservationDto) {
    // 학생이 이석 요청을 한다, 이 API를 사용한다.
    return await this.certificationService.requestRoom(requestReservationDto);
  }

  /// 예약을 승인 및 거부하는 API ///
  @Post('/response')
  // @Roles(BsmOauthUserRole.TEACHER)
  async responseToStudents(
    @Req() req: Request,
    @Body() responseReservationDto: ResponseReservationDto,
  ) {
    const teacherInfo: TeacherInfo = <TeacherInfo>req.user;
    return await this.certificationService.responseRoom(
      teacherInfo,
      responseReservationDto,
    );
  }
}
