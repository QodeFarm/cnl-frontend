import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-orderslist',
  templateUrl: './orderslist.component.html',
  standalone: true,
  imports: [CommonModule, AdminCommmonModule],
  styleUrls: ['./orderslist.component.scss']
})
export class OrderslistComponent {
  @Input() customerOrders: any[] = [];
  @Output() orderSelected = new EventEmitter<any>();
  @Input() noOrdersMessage: string = '';
  @Output() modalClosed = new EventEmitter<void>();


  selectOrder(order: any) {
    this.orderSelected.emit(order);
  }
  
  hideModal() {
    // Emit an event to the parent component indicating the modal should be closed
    this.modalClosed.emit();
  }
}