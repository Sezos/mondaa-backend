export class CreateUserDto {
  firstName: string;
  lastName: string;
  nickname: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  emergencyPhone: string;
  emergencyName: string;
  emergencyEmail: string;
  accountBSB?: string;
  accountNumber?: string;
  accountName?: string;
  workABN?: string;
  workTFN?: string;
  workVisaType?: string;
  rate?: string;
  experience?: string;
  position?: string;
  isGst?: number;
}
