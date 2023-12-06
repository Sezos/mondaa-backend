import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Body,
  Request,
} from '@nestjs/common';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('/:id')
  create(
    @Param()
    param: {
      id: number;
    },
    @Request()
    request: {
      user: any;
    },
    @Body()
    body: {
      isFolder: boolean;
      name: string;
      file: string;
      parentId: number;
    },
  ) {
    return this.filesService.create(
      body.isFolder,
      body.name,
      +request.user.id,
      body.file,
      +param.id,
    );
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get('/file/:id')
  findFile(@Param('id') id: string) {
    return this.filesService.findOne(+id);
  }

  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.filesService.findAll(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
