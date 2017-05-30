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
  public userdata2;
  public name;

  constructor(userdetails:CookieService,private _http: Http,private router: Router,admindata:CookieService) {
    this.coockieData=userdetails;
    this.userdata2 = userdetails.getObject('userdetails');
    this.name= this.userdata2.firstname+" "+this.userdata2.lastname;

  }

  ngOnInit() {
  }


  logout()
  {
    var link = 'http://influxiq.com:3001/updateipaddress';
    var data = {email: this.userdata2.email};
    this._http.post(link, data)
        .subscribe(res => {
          var result = res.json();
        }, error => {
          console.log("Oooops!");
        });

    this.coockieData.removeAll();
    this.router.navigateByUrl('/login');

  }
}
