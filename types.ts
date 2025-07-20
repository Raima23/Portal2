export enum Centre {
  RAJOURI_GARDEN = 'Rajouri Garden',
  SOUTH_EXTENSION = 'South Extension',
  PITAMPURA = 'Pitampura',
  NIRMAN_VIHAR = 'Nirman Vihar',
}

export enum UserRole {
  ADMIN = 'Admin',
  COUNSELLOR = 'Counsellor',
}

export enum EnquiryType {
  TELEPHONE = 'Telephone',
  INSTAGRAM = 'Instagram',
  SOCIAL_MEDIA = 'Social Media',
  WALK_IN = 'Walk-in',
  WEB_FORM = 'Web Form',
  OTHER = 'Other',
}

export enum Counsellor {
    PARI = 'Pari',
    RADHIKA = 'Radhika',
}

export enum EnquiryStatus {
  ADMISSION_DONE = 'Admission Done',
  FOLLOW_UP = 'Follow Up',
}

export interface AdmissionDetails {
    admissionDate: string;
    fees: number;
    receiptNo: string;
}

export interface CertificateDetails {
    issueDate: string;
    certificateNo: string;
}

export interface FollowUp {
    date: string; // YYYY-MM-DD format
    remarks: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  phone2?: string;
  email: string;
  course: string;
  latestQualification?: string;
  type: EnquiryType;
  status: EnquiryStatus;
  dateAdded: string; // ISO string format
  centre: Centre;
  counsellor?: Counsellor;
  referralName?: string;
  followUpHistory?: FollowUp[];
  admissionDetails?: AdmissionDetails;
  certificateDetails?: CertificateDetails;
}