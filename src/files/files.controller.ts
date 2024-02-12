import {
  Controller,
  Get,
  Post,
  Param,
  Delete,
  Body,
  Request,
  Patch,
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
    if (!body.name || !request.user.id) {
      return {
        status: 'Error',
        message: 'Please Provide Name',
      };
    }
    if (!body.isFolder && !body.file) {
      return {
        status: 'Error',
        message: 'Please Provide File',
      };
    }
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

  @Patch()
  Checked(@Body() body: { ids: number[] }) {
    return this.filesService.checked(body.ids);
  }

  @Patch('/:id')
  CheckOne(@Param('id') id: string) {
    return this.filesService.checkOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
