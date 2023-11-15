// import { UseGuards } from '@nestjs/common/decorators';
// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Patch,
//   Param,
//   Delete,
// } from '@nestjs/common';
// import { StateService } from './state.service';
// import { Role } from 'src/user/roles.decorator';
// import { RolesGuard } from 'src/user/role.guard';

// @Controller('state')
// export class StateController {
//   constructor(private readonly stateService: StateService) {}

//   @UseGuards(RolesGuard)
//   @Role('Manager')
//   @Post()
//   create(@Body() data: { name: string; shortName: string }) {
//     return this.stateService.create(data);
//   }

//   @Get()
//   findAll() {
//     return this.stateService.findAll();
//   }

//   @UseGuards(RolesGuard)
//   @Role('Manager')
//   @Patch(':id')
//   update(
//     @Param('id') id: string,
//     @Body() data: { name: string; shortName: string },
//   ) {
//     return this.stateService.update(+id, data);
//   }

//   @UseGuards(RolesGuard)
//   @Role('Manager')
//   @Delete(':id')
//   remove(@Param('id') id: string) {
//     return this.stateService.remove(+id);
//   }
// }
