
import { Component, OnInit } from '@angular/core';
import {ExampleService } from '../example.service';

@Component({
  selector: 'app-about',
 // templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  providers: [ExampleService],
  // template:'<h1>{{a}}</h1>',
  template: `
      <div>
          <button (click)="loadUser()">Load profile</button>
          {{ profile | json }}
      </div>
  `
})
export class AboutComponent implements OnInit {
public a:any;

  constructor(private _exampleservice: ExampleService) { }
  profile = {};
  loadUser() {
    this._exampleservice.getUser().subscribe(data => this.profile = data);
  }
  ngOnInit() {
    //this.a=this._exampleservice.Greetings();
  }

}


