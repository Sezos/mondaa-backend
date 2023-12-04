import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GroupUserService } from './group-user.service';

@Controller('groupUser')
export class GroupUserController {
  constructor(private readonly groupUserService: GroupUserService) {}

  @Post()
  create(@Body() body: { groupId: number; users: number[] }) {
    return this.groupUserService.create(body.groupId, body.users);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupUserService.findAll(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.groupUserService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupUserService.remove(+id);
  }
}
