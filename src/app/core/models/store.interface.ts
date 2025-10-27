// export interface Store {
//   id: number;
//   name: string;
//   location: string;
//   owner: string;
//   contactPhone: string;
//   contactEmail: string;
//   address: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   isActive: boolean;
//   createdAt: Date;
// }
export interface Store {
  id: number;
  ownerName: string;
  businessName: string;
  businessEmail: string;
  businessPhoneNo: string;
  personalPhoneNo: string;
  gstNumber: string;
  businessDocs: string;
  businessAddress: any;
  businessFrontImage: string;
  isVerified: boolean;
}
