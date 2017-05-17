import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import { Router, ActivatedRoute} from '@angular/router';
import {DomSanitizer} from "@angular/platform-browser";
import {CookieService} from 'angular2-cookie/core';
import {Commonservices} from "../app.commonservices";
declare var $:any;
@Component({
  selector: 'app-viewreviewofemployee',
  templateUrl: './viewreviewofemployee.component.html',
  styleUrls: ['./viewreviewofemployee.component.css'],
  providers: [Commonservices]
})
export class ViewreviewofemployeeComponent implements OnInit {
  id:number;
    employeeid:number;
  public itemdetails;
  public userdata2;
  coockieData:CookieService;
  commonservices:Commonservices;
  serverUrl:any;
  items:any;
  constructor(private _http: Http,private router: Router, private route: ActivatedRoute, private _sanitizer: DomSanitizer,  userdetails:CookieService,  private _commonservices: Commonservices) {
    this.coockieData=userdetails;
    this.userdata2 = userdetails.getObject('userdetails');
    this.commonservices=_commonservices;
    this.items = _commonservices.getItems();
    this.serverUrl = this.items[0].serverUrl;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.employeeid = params['employeeid'];
      this.getreviewofemployee();
    },error=>{
      console.log(error);
      this.router.navigate(['/employeelist']);
    });
  }
  getreviewofemployee(){
    var link =this.serverUrl+'getreviewofemployee?id='+this.id+'&employeeid='+this.employeeid;
   // var link = 'http://influxiq.com:3001/getreviewofemployee?id='+this.id+'&employeeid='+this.employeeid;
    //var data = {_id : this.id};
    this._http.get(link)
        .subscribe(res => {
          var result = res.json();
          this.itemdetails=result;
          console.log(this.itemdetails);
        }, error => {
          console.log("Oooops!");
        });
  }

}
