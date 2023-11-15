import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Request, UseGuards } from '@nestjs/common/decorators';
import { RolesGuard } from 'src/user/role.guard';
import { Role } from 'src/user/roles.decorator';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Role('Manager')
  create(
    @Body()
    data: {
      projectLocation: number;
      date: string;
      users: number[];
    },
  ) {
    return this.projectService.create(data);
  }

  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Post('byDate')
  byDate(@Request() request, @Body() data: { date: string }) {
    return this.projectService.byDate(request.user, data.date);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: { projectLocationId: number }) {
    return this.projectService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }
}
