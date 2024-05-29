import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ta-core',
  template: `
    <p>
      ta-core works!
    </p>
  `,
  styles: [
  ]
})
export class TaCoreComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // console.log('oninit');
  }

}
