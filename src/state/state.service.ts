// import { Injectable } from '@nestjs/common';
// import { PrismaService } from './../services/prisma.service';

// @Injectable()
// export class StateService {
//   constructor(private prisma: PrismaService) {}

//   create(data: { name: string; shortName: string }) {
//     return this.prisma.state.create({
//       data,
//     });
//   }

//   findAll() {
//     return this.prisma.state.findMany({
//       where: {
//         status: 'InUse',
//       },
//       select: {
//         id: true,
//         name: true,
//         shortName: true,
//       },
//     });
//   }

//   update(id: number, data: { name: string; shortName: string }) {
//     return this.prisma.state.update({
//       where: {
//         id,
//       },
//       data,
//     });
//   }

//   remove(id: number) {
//     return this.prisma.state.update({
//       where: {
//         id,
//       },
//       data: {
//         status: 'Deleted',
//       },
//     });
//   }
// }
