export interface watchmen {
  watchmenId?: string; // Firestore document ID
  firstName: string;
  lastName: string;
  dob: Date;
  phoneNumber: string;
  aadharNumber: string;
  city: string;
  state: string;
  pincode: string;
  address: string;
  gender: string; // New field for gender
  age: number; // New field for age
  role: string; // New field for role (e.g., Security Guard, Area Officer)
  placeOfBirth: string; // New field for place of birth
  district: string; // New field for district
  guards_qualification: string; // New field for guard's qualification
  documents: {
    id?: string; // ID document URL
    pccno?: string; // Police Clearance Certificate URL
    trainingcertificate?: string; // Training Certificate URL
  }; // New field for nested documents
  photoURL?: string; // URL for the photo
  createdAt?: Date; // Optional, for tracking creation date
  updatedAt?: Date; // Optional, for tracking last updated date
}
