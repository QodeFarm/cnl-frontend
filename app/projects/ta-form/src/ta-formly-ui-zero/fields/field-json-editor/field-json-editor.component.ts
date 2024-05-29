import { Component, OnInit } from '@angular/core';
import { JsonEditorOptions } from '@maaxgr/ang-jsoneditor';
import { FieldType } from '@ngx-formly/core';
import { TaCoreService } from '@ta/ta-core';

@Component({
  selector: 'ta-field-json-editor',
  templateUrl: './field-json-editor.component.html',
  styleUrls: ['./field-json-editor.component.css']
})
export class FieldJsonEditorComponent extends FieldType implements OnInit {

  public editorOptions: JsonEditorOptions;
  public initialData: any;
  public visibleData: any;
  field: any;
  editorConfig:any = {
    plugId:'json-editor',
    changeFn:(data)=>{
      this.formControl.setValue(data);
    }
  }
  show = false;

  constructor(private tc: TaCoreService) {
    super();
    // this.editorOptions = new JsonEditorOptions()
    // this.editorOptions.modes = ['code', 'text', 'tree', 'view'];
    // this.editorOptions.mode = 'code';
    // this.initialData = {}
    // this.visibleData = this.initialData;
    //this.tc.loadStyle('assets/css/lib/jsoneditor/jsoneditor.min.css', 'jsoneditor');

  }
  ngOnInit(): void {
    this.formControl.valueChanges.subscribe((data)=>{
      if(!this.editorConfig.data){
        this.editorConfig.data = this.formControl.value;
      }
    });
  }
  ngAfterViewInit(): void{
    this.show = true;
  }

  showJson(d: any) {
    this.visibleData = d;
    this.formControl.setValue(d);
  }
  

}
