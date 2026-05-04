import { Component } from '@angular/core';
import { TaCurdConfig } from '@ta/ta-curd';
import { LedgerGroupsConfig } from 'src/app/utils/master-curd-config';

@Component({
  selector: 'app-ledger-groups',
  templateUrl: './ledger-groups.component.html',
  styleUrls: ['./ledger-groups.component.scss']
})
export class LedgerGroupsComponent {
  curdConfig: TaCurdConfig = LedgerGroupsConfig;
}
