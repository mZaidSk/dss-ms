// models/wing.model.ts
export interface Wing {
  wingId: string;        // Unique identifier for the wing
  wingName: string;      // Name of the wing
  buildingId: string;    // Reference to the building it belongs to
  numberOfFloors: number;  // Number of floors in the wing
  roomsPerFloor: number;   // Number of rooms per floor in the wing
}
