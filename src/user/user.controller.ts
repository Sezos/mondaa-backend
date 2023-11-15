import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Public } from 'src/auth/public.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesGuard } from './role.guard';
import { Role } from './roles.decorator';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  @Public()
  async create(@Body() createUsersDto: CreateUserDto) {
    return this.usersService.create(createUsersDto);
  }

  @Post('forgot-password')
  @Public()
  async forgotPassword(@Body() data: { email: string }) {
    return this.usersService.forgotPassword(data);
  }

  @Post('reset-password')
  @Public()
  async resetPassword(
    @Body()
    { email, password }: { email: string; password?: string },
  ) {
    return this.usersService.resetPassword(email, password);
  }

  @Get('/confirm/:link')
  @Public()
  async confirm(@Param('link') link: string, @Res() res: any) {
    res.redirect(await this.usersService.confirm(link));
  }

  @Get('roles')
  @UseGuards(RolesGuard)
  @Role('Manager')
  async roles() {
    return this.usersService.roles();
  }

  @Get('statuses')
  @UseGuards(RolesGuard)
  @Role('Manager')
  async statuses() {
    return this.usersService.statuses();
  }

  @Get('employees')
  async employees() {
    return this.usersService.employees();
  }

  @Get('employees/count')
  async countEmployees() {
    return this.usersService.countEmployees();
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Role('Manager')
  async all() {
    return this.usersService.all();
  }

  @Get('employees/:date')
  @UseGuards(RolesGuard)
  @Role('Manager')
  async employeesByDate(@Param('date') date: string) {
    return this.usersService.employeesByDate(date);
  }

  @Get('employeesOff/:date')
  @UseGuards(RolesGuard)
  @Role('Manager')
  async employeesOff(@Param('date') date: string) {
    return this.usersService.employeesOff(date);
  }

  @Post('setFcm')
  async setFcm(@Request() request, @Body() body: { token: string }) {
    return this.usersService.setFcm(request.user, body.token);
  }

  @Post('setRole')
  @UseGuards(RolesGuard)
  @Role('Manager')
  async setRole(
    @Body()
    data: {
      id: number;
      role: 'Manager' | 'Leader' | 'Employee';
      employeeId: string;
    },
  ) {
    return this.usersService.setRole(data);
  }

  @Post('setStatus')
  @UseGuards(RolesGuard)
  @Role('Manager')
  async setStatus(
    @Body()
    data: {
      id: number;
      status: 'Approved' | 'Suspended';
    },
  ) {
    return this.usersService.setStatus(data);
  }

  @Post('setAvatar')
  async setAvatar(@Request() request, @Body() data: { image: string }) {
    return this.usersService.setAvatar(request.user, data.image);
  }

  @Post('uploadFile')
  async uploadFile(
    @Request() request,
    @Body() data: { image: string; type: string },
  ) {
    return this.usersService.uploadFile(request.user, data.image, data.type);
  }

  @Post('setWhiteCard')
  async setWhiteCard(@Request() request, @Body() data: { image: string }) {
    return this.usersService.setWhiteCard(request.user, data.image);
  }

  @Get('info')
  async info(@Request() request) {
    return this.usersService.getInfo(request.user);
  }

  @Get('info/:id')
  @UseGuards(RolesGuard)
  @Role('Manager')
  getInfo2(@Param('id') id: string) {
    return this.usersService.getInfo2(+id);
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Role('Manager')
  async updateEmployee(@Param('id') id: string, @Body() data: any) {
    return this.usersService.updateEmployee(id, data);
  }

  @Patch()
  async update(@Request() request, @Body() updateUsersDto: UpdateUserDto) {
    return this.usersService.update(request.user, updateUsersDto);
  }
}
