import { RegisterStatus, UserRoleType } from '@prisma/client';

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
  employeeId?: string;
  avatar?: string;
  PhotoID?: string;
  PhotoIDBack?: string;
  OtherCard?: string;
  workWhiteCard?: string;
  workWhiteCardBack?: string;
  email?: string;
  workTFN?: string;
  role?: UserRoleType;
  isReviewed?: number;
  experience?: string;
  isGST?: boolean;
  rate?: number;
}
