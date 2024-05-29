import { Component, Injectable, Input } from "@angular/core";
@Component({
  template: ''
})
export abstract class  TaCoreComponent {
    @Input() options: any;
  
    constructor() {
      // console.log(`new - data is ${this.options}`);
    }
  
    ngOnChanges() {
      // console.log(`ngOnChanges - data is ${this.options}`);
    }
  
    ngOnInit() {
      // console.log(`ngOnInit  - data is ${this.options}`);
      // console.log('this',this.options);
    }
  
    ngDoCheck() {
      // // console.log("ngDoCheck")
    }
  
    ngAfterContentInit() {
      // console.log("ngAfterContentInit");
    }
  
    ngAfterContentChecked() {
     // // console.log("ngAfterContentChecked");
    }
  
    ngAfterViewInit() {
      // console.log("ngAfterViewInit");
    }
  
    ngAfterViewChecked() {
      // // console.log("ngAfterViewChecked");
    }
  
    ngOnDestroy() {
      // console.log("ngOnDestroy");
    }
  }