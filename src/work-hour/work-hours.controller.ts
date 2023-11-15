import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  // Delete,
  // Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { WorkHourService } from './work-hours.service';

import { RolesGuard } from 'src/user/role.guard';
import { Role } from 'src/user/roles.decorator';

@Controller('work-hour')
export class WorkHourController {
  constructor(private readonly workHourService: WorkHourService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Role('Leader')
  addWorkHour(
    @Body()
    data: {
      userId: number;
      hours: number;
      projectId: number;
    },
  ) {
    return this.workHourService.add(data);
  }

  @Post('getMany')
  getWorkHours(
    @Body()
    data: any,
  ) {
    return this.workHourService.get(data);
  }

  @Get('getTotal')
  getTotal(
    @Query()
    query: {
      from: string;
      to: string;
      employeeId?: string;
      projectLocationId?: string;
    },
  ) {
    return this.workHourService.getTotal(query);
  }

  @Get('getTotalEmployee')
  getTotalEmployee(
    @Query()
    query: {
      from: string;
      to: string;
      employeeId?: string;
    },
  ) {
    return this.workHourService.getTotalEmployee(query);
  }

  @Get('download')
  downloadTotalEmployee(
    @Query()
    query: {
      from: string;
      to: string;
      employeeId?: string;
    },
  ) {
    return this.workHourService.downloadWorkHours(query);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Role('Leader')
  removeWorkHour(
    @Param('id')
    id: string,
  ) {
    return this.workHourService.remove(parseFloat(id));
  }
}
