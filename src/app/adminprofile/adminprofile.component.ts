import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Http} from "@angular/http";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
import {Commonservices} from "../app.commonservices";
@Component({
  selector: 'app-adminprofile',
  templateUrl: './adminprofile.component.html',
  styleUrls: ['./adminprofile.component.css'],
  providers: [Commonservices]
})
export class AdminprofileComponent implements OnInit {
  private dataForm:FormGroup;
  private fb;
  private adminid;
  private admindata:CookieService;
  public admindetails:any;
  items:any;
  serverUrl:any;
  commonservices:Commonservices;

  constructor(fb: FormBuilder,private _http: Http,private router: Router,admindata:CookieService, private _commonservices: Commonservices) {
    this.commonservices=_commonservices;
    this.items = _commonservices.getItems();
    this.serverUrl = this.items[0].serverUrl;
    this.fb = fb;
    let admindata2: any;
    admindata2= admindata.getObject('userdetails');

    if (typeof (admindata2) == 'undefined') {
      this.router.navigateByUrl('/login');
    } else {
      this.adminid = admindata2._id;
      console.log(this.adminid);
      this.getAdminDetails();
    }
  }

  ngOnInit() {
  }

  getAdminDetails(){
    var link =this.serverUrl+'admindetails';

    //var link = 'http://influxiq.com:3001/admindetails';
    var data = {_id: this.adminid};

    this._http.post(link, data)
        .subscribe(res => {
          var result = res.json();

          console.log(result);

          if (result.status == 'success' && typeof(result.item) != 'undefined') {
            let userdet = result.item;
            this.admindetails = userdet;
            console.log(this.admindetails);
          }else{
            this.router.navigateByUrl('/admin_dashboard');
          }

        }, error => {
          console.log("Oooops!");
        });
  }



}
