import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  // Request,
  UseGuards,
} from '@nestjs/common/decorators';
import { RolesGuard } from 'src/user/role.guard';
import { Role } from 'src/user/roles.decorator';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ProjectLocationService from './projectLocation.service';

@Controller('project_location')
export class ProjectLocationController {
  constructor(
    private readonly ProjectLocationService: ProjectLocationService,
  ) {}

  @Post()
  @UseGuards(RolesGuard)
  @Role('Manager')
  create(
    @Body()
    data: {
      name: string;
      formanId: number;
      address: string;
    },
  ) {
    return this.ProjectLocationService.create(data);
  }

  @Get()
  findAll() {
    return this.ProjectLocationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ProjectLocationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: { name: string }) {
    return this.ProjectLocationService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ProjectLocationService.remove(+id);
  }
}
