// models/visitor.model.ts
export interface Visitor {
  visitorId: string;        // Unique identifier for the visitor
  roomId: string;
  wingId: string;
  buildingId: string;
  name: string;             // Visitor's name
  phoneNo: string;          // Visitor's name
  work: string;             // Purpose or reason for visiting
  workAddress: string;
  checkInTime: Date;        // Time the visitor checked in
  checkOutTime?: Date;      // Time the visitor checked out (optional)
  additionalNotes?: string; // Any additional notes or comments regarding the visit (optional)
}

