import { RegisterStatus } from '@prisma/client';

export class UpdateUserDto {
  firstName?: string;
  lastName?: string;
  nickName?: string;
  phone?: string;
  address?: string;
  emergencyPhone?: string;
  emergencyName?: string;
  emergencyEmail?: string;
  accountBSB?: string;
  accountNumber?: string;
  accountName?: string;
  workABN?: string;
  workVisaType?: string;
  status?: RegisterStatus;
}
