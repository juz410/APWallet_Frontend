export interface User{
  user_id: string
  email: string
  name: string
  phone_number: string
  balance: number
  registered_at: Date
  role: string
}

export interface RecentUser{
  user_id: string
  name: string
}

export interface Card{
  card_id: number,
  card_number: string,
  registered_at: Date,
  user: User
}

export interface StudentPhoto {
  id: string;
  base64_photo: string;
}

export interface StaffProfile {
  REFNO: number;
  PHOTO: string;
  ID: string;
  FULLNAME: string;
  DOB: string;
  NRIC: string;
  PASSPORTNO: string;
  NATIONALITY: string;
  TITLE: string;
  DEPARTMENT: string;
  DEPARTMENT2: string;
  DEPARTMENT3: string;
  CURRENT_JOB_TYPE: string;
  EMAIL: string;
  DID: string;
  EXTENSION: string;
  CODE: string;
}