export interface Wing {
  wingName: string; // Name of the wing
  numberOfFloors: number; // Number of floors in the wing
  roomsPerFloor: number; // Number of rooms per floor in the wing
  watchmen: watchmen[]; // watchmen
}

interface watchmen {
  watchmenId: string; // watchmen
  sift: string; // watchmen
}

interface Location {
  state: string; // State where the building is located
  city: string; // City where the building is located
  pincode: string; // Postal code for the location
  address: string; // Specific address of the building
}

export interface Building {
  buildingId: string;
  name: string;
  wings: Wing[];
  location: Location;
}
