import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/User.entity';
import { CustomRepository } from 'src/TypeormForCustomRepository/CustomRepository.decorator';
import { Role } from '../types/Role.type';

@CustomRepository(User)
export class UserRepository extends Repository<User> {}
