import { Module } from '@nestjs/common';
import { GroupUserService } from './group-user.service';
import { GroupUserController } from './group-user.controller';
import { PrismaService } from 'src/services/prisma.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [GroupUserController],
  providers: [GroupUserService, PrismaService],
})
export class GroupUserModule {}
