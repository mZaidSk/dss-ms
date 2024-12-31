export interface Feedback {
  roomId: string; // Unique identifier for the room
  roomNumber: string; // Room number
  buildingId: string; // Reference to the building it belongs to
  wingId: string; // Reference to the wing it belongs to
  username: string; // Username for room access
  password: string; // Hashed password for room access
}
