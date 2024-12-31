import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent {
  // Accepts an array of objects as table data
  @Input() tableData: any[] = [];
  @Input() showAction?: boolean = true;

  // Accepts an array of column configurations
  @Input() columns: { key: string; display: string }[] = [];

  // Emits an event for action buttons like edit or delete
  @Output() onView: EventEmitter<any> = new EventEmitter();
  @Output() onEdit: EventEmitter<any> = new EventEmitter();
  @Output() onDelete: EventEmitter<any> = new EventEmitter();

  viewRow(row: any) {
    this.onView.emit(row);
  }

  // Function to trigger the edit event
  editRow(row: any) {
    this.onEdit.emit(row);
  }

  // Function to trigger the delete event
  deleteRow(row: any) {
    this.onDelete.emit(row);
  }

  products = [
    {
      name: 'Apple MacBook Pro 17"',
      color: 'Silver',
      category: 'Laptop',
      price: 2999,
    },
    {
      name: 'Microsoft Surface Pro',
      color: 'White',
      category: 'Laptop PC',
      price: 1999,
    },
    {
      name: 'Magic Mouse 2',
      color: 'Black',
      category: 'Accessories',
      price: 99,
    },
    {
      name: 'Apple Watch',
      color: 'Black',
      category: 'Watches',
      price: 199,
    },
    {
      name: 'Apple iMac',
      color: 'Silver',
      category: 'PC',
      price: 2999,
    },
    {
      name: 'Apple AirPods',
      color: 'White',
      category: 'Accessories',
      price: 399,
    },
    {
      name: 'iPad Pro',
      color: 'Gold',
      category: 'Tablet',
      price: 699,
    },
    {
      name: 'Magic Keyboard',
      color: 'Black',
      category: 'Accessories',
      price: 99,
    },
  ];
}
