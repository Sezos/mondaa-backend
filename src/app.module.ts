import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { ProjectUserModule } from './project-user/project-user.module';
import { WorkHourModule } from './work-hour/work-hours.module';
import { ProjectModule } from './project/project.module';
import { PrismaService } from './services/prisma.service';
import { UserModule } from './user/user.module';
// import { StateModule } from './state/state.module';
import { ProjectLocationModule } from './project_location/projectLocation.module';
import { NotificationService } from './services/notification.service';
import { EventsGateway } from './events/events.gateway';
import { ChatModule } from './Chat/chat.module';
import { GroupModule } from './group/group.module';
import { GroupUserModule } from './group-user/group-user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MailModule,
    ProjectModule,
    ProjectLocationModule,
    ProjectUserModule,
    WorkHourModule,
    ChatModule,
    GroupModule,
    GroupUserModule,
    // StateModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService, NotificationService, EventsGateway],
})
export class AppModule {}
