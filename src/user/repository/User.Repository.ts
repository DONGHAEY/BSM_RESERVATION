import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entity/User.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {}
