import {
  Body,
  Controller,
  Get,
  // Delete,
  // Param,
  Post,
  Query,
} from '@nestjs/common';

import { ProjectUserService } from './project-user.service';

@Controller('project-user')
export class ProjectUserController {
  constructor(private readonly projectUserService: ProjectUserService) {}

  @Get('/count')
  count(@Query() dates: { from: string; to: string }) {
    return this.projectUserService.count(dates);
  }

  @Get()
  getMany(@Query() dates: { from: string; to: string }) {
    return this.projectUserService.getMany(dates);
  }

  @Post()
  create(@Body() data: { projectId: number; userIds: number[] }) {
    return this.projectUserService.create(data);
  }

  @Post('/delete')
  removeMany(@Body() data: { projectId: number; projectUserIds: number[] }) {
    return this.projectUserService.removeMany(data);
  }
}
