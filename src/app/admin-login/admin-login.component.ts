import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Http} from "@angular/http";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  public dataForm:FormGroup;
  private fb;
  private isSubmit;
  private isemailvalidate;
  public is_error;
  private userdata:CookieService;
  private userdetails;

  constructor(fb: FormBuilder,private _http: Http,private router: Router,userdata:CookieService) {
    this.fb = fb;

    this.userdata = userdata;
    //console.log(this.userdata);
    console.log(this.userdata);
    this.userdetails=this.userdata.getObject('userdetails');
    console.log("hello");
    console.log(this.userdetails);
    if(typeof (this.userdetails) != 'undefined'){
      this.router.navigateByUrl('/admin_dashboard(header:admin_header//leftsidebar:admin_leftsidebar)');
    }
  }

  ngOnInit() {
    this.isSubmit=false;
    this.isemailvalidate=false;

    this.dataForm=this.fb.group({
      email:["",Validators.required],
      password:["",Validators.required],
    });
  }
  haserrorcls(cntrlname){
    if(!this.dataForm.controls[cntrlname].valid && this.isSubmit)
      return 'has-error';

    return '';
  }

  showerrorcls(cntrlname,type='reuired'){
    if(!this.dataForm.controls[cntrlname].valid && this.isSubmit)
      return '';



    return 'hide';
  }




  dosubmit(formval){

    this.is_error = 0;

    this.isSubmit = true;

    if(this.dataForm.valid){
      var link = 'http://influxiq.com:3001/adminlogin';
      var data = {email: formval.email,password: formval.password};

      this._http.post(link, data)
          .subscribe(res => {
            var result = res.json();
            //console.log(result.status);
            //console.log(result.msg); //getting the items[0] value here in the form of array
            if(result.status=='success'){
              this.userdata.putObject('userdetails', result.msg);    // Value of result.msg is inserted to userdetails

              this.router.navigateByUrl('/admin_dashboard(header:admin_header//leftsidebar:admin_leftsidebar)');

            }
            else {

              this.is_error=result.msg;

              this.router.navigate(['/admin_login']);
            }

          }, error => {
            console.log("Oooops!");
          });
    }
  }



}










/*
import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Http} from "@angular/http";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {
  public dataForm:FormGroup;
  private fb;
  private isSubmit;
  private isemailvalidate;
  public is_error;


  constructor(fb: FormBuilder,private _http: Http,private router: Router) {
    this.fb = fb;

  }

  ngOnInit() {
    this.isSubmit=false;
    this.isemailvalidate=false;

    this.dataForm=this.fb.group({
    email:["",Validators.required],
    password:["",Validators.required],
        });
  }
  haserrorcls(cntrlname){
    if(!this.dataForm.controls[cntrlname].valid && this.isSubmit)
      return 'has-error';

    return '';
  }

  showerrorcls(cntrlname,type='reuired'){
    if(!this.dataForm.controls[cntrlname].valid && this.isSubmit)
      return '';



    return 'hide';
  }

  dosubmit(formval){

    this.is_error = 0;

    this.isSubmit = true;

    if(this.dataForm.valid){
      var link = 'http://influxiq.com:3001/adminlogin';
      var data = {email: formval.email,password: formval.password};


      this._http.post(link, data)
          .subscribe(res => {
            var result = res.json();
            //console.log(result.status);
            if(result.status=='success'){

              this.router.navigate(['/adminlist']);
            }
            else {

              //console.log(result.msg);

              this.is_error=result.msg;
              //console.log(this.is_error);
              this.router.navigate(['/admin_login']);
            }


          }, error => {
            console.log("Oooops!");
          });
    }
  }



}
*/
