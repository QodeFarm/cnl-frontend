import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TaTableService } from '../ta-table.service';
import { TaActionService } from '@ta/ta-core';

@Component({
  selector: 'ta-table-actions',
  templateUrl: './table-actions.component.html',
  styleUrls: ['./table-actions.component.css']
})
export class TableActionsComponent implements OnInit {
  @Input() row: any;
  @Input() actions: any[] = [];
  @Output() clickAction: EventEmitter<any> = new EventEmitter();
  constructor(private tableS: TaTableService, private ta: TaActionService) { }

  ngOnInit(): void {

  }
  action(action: any, event) {
    //event.stopPropagation();
    if (action.type == 'callBackFn') {
      return action.callBackFn(this.row, action);
    }
    // window['$this']=this.row;
    this.clickAction.emit({ action: action, data: this.row })
    this.ta.doAction(action, { row: this.row, $this: this.row });
    this.tableS.actionChange({ action: action, data: this.row });
  }
  checkCondition(a: any) {
    if (a.conditionFn) {
      return a.conditionFn(this.row, a);
    }
    if (a.isVisible) {
      return a.isVisible(this.row);
    }
    return true;
  }
}
