import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  //template: '<router-outlet name="header"></router-outlet><router-outlet></router-outlet><router-outlet name="footer"></router-outlet>',
  template: '<router-outlet name="header"></router-outlet><router-outlet></router-outlet><router-outlet name="footer"></router-outlet>',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app works!';
}
