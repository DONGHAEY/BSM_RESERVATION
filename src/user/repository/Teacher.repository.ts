import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/User.entity';
import { CustomRepository } from 'src/TypeormForCustomRepository/CustomRepository.decorator';
import { Role } from '../types/Role.type';
import { TeacherInfo } from '../entity/TeacherInfo.entity';

@CustomRepository(TeacherInfo)
export class TeacherRepository extends Repository<TeacherInfo> {}
