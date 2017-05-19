import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import { Router, ActivatedRoute} from '@angular/router';
import {DomSanitizer} from "@angular/platform-browser";
import {CookieService} from 'angular2-cookie/core';
import {Commonservices} from "../app.commonservices";

@Component({
  selector: 'app-employeeloginouttime',
  templateUrl: './employeeloginouttime.component.html',
  styleUrls: ['./employeeloginouttime.component.css'],
  providers: [Commonservices]
})
export class EmployeeloginouttimeComponent implements OnInit {
  public itemdetails;
  public userdata2;
  coockieData:CookieService;
  commonservices:Commonservices;
  serverUrl:any;
  items:any;
  constructor(private _http: Http,private router: Router, private route: ActivatedRoute, private _sanitizer: DomSanitizer, userdetails:CookieService,  private _commonservices: Commonservices) {
    this.coockieData=userdetails;
    this.userdata2 = userdetails.getObject('userdetails');
    this.commonservices=_commonservices;
    this.items = _commonservices.getItems();
    this.serverUrl = this.items[0].serverUrl;
  }

  ngOnInit() {
    var link =this.serverUrl+'viewloginouttime';
    this._http.get(link)
        .subscribe(res => {
          var result = res.json();
          console.log("hi");
          console.log(result);
          this.itemdetails=result;

        }, error => {
          console.log("Oooops!");
        });
  }

}
