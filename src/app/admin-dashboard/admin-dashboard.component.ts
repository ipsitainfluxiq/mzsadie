import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Http} from "@angular/http";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {CookieService} from 'angular2-cookie/core';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  private dataForm:FormGroup;
  private fb;
  private userid;

  private isSubmit;

  private userdata:CookieService;

  public userdetails:any=[];    // declare userdetails as an array to fetch the object details


  constructor(fb: FormBuilder,private _http: Http,private router: Router,userdata:CookieService) {
    this.fb = fb;
    let userdata2: any;
    userdata2= userdata.getObject('userdetails');

    //console.log(userdata2);

    if (typeof (userdata2) == 'undefined') {
      this.router.navigateByUrl('/admin_login');
    } else {
      this.userid = userdata2._id;
      this.getUserDetails();
    }

  }

  ngOnInit() {

  }

    getUserDetails()
    {
      //console.log("called..");
      var link = 'http://influxiq.com:3001/admindetails';
      var data = {_id: this.userid};


      this._http.post(link, data)
          .subscribe(res => {
            var result = res.json();
            //console.log(result.item);
            if (result.status == 'success' && typeof(result.item) != 'undefined') {
              let userdet = result.item;
              //console.log(userdet);
              this.userdetails = userdet;
              /*console.log(this.userdetails);
              console.log(this.userdetails._id);
              console.log(this.userdetails.firstname);
              console.log(this.userdetails.lastname);*/
            }

          }, error => {
            console.log("Oooops!");
          });
    }





}
