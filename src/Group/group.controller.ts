import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  create(
    @Body() body: { name: string; users: number[] },
    @Request() req: { user: any },
  ) {
    return this.groupService.create(body.name, body.users, req.user);
  }

  @Get()
  findAll(@Request() request) {
    return this.groupService.findAll(request.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: {
      name?: string;
      addUserIds?: number[];
      removeUserIds?: number[];
    },
  ) {
    return this.groupService.update(
      +id,
      body.name,
      body.addUserIds,
      body.removeUserIds,
    );
  }

  @Post(':id')
  async setImage(@Param('id') id: string, @Body() data: { image: string }) {
    return this.groupService.setImage(+id, data.image);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupService.remove(+id);
  }
}
