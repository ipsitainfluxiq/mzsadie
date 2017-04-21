import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
@Component({
  selector: 'app-admin-leftsidebar',
  templateUrl: './admin-leftsidebar.component.html',
  styleUrls: ['./admin-leftsidebar.component.css']
})
export class AdminLeftsidebarComponent implements OnInit {

  coockieData:CookieService;
  constructor(userdetails:CookieService,private _http: Http,private router: Router,admindata:CookieService) {
    this.coockieData=userdetails;
  }

  ngOnInit() {
  }
  logout()
  {

    this.coockieData.removeAll();
    this.router.navigateByUrl('/admin_login');



  }
}
