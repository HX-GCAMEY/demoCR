import { Module } from '@nestjs/common';
import { UserController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from './users.repository';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  controllers: [UserController],
  providers: [UsersService, UserRepository],
})
export class UsersModule {}