import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Http} from "@angular/http";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
import {Commonservices} from "../app.commonservices";
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [Commonservices]
})
export class LoginComponent implements OnInit {
  public dataForm:FormGroup;
  private fb;
  private isSubmit;
  private isemailvalidate;
  public is_error;
  private userdata:CookieService;
  private userdetails;
  items:any;
  serverUrl:any;
  public ipaddress;
  commonservices:Commonservices;
  constructor(fb: FormBuilder,private _http: Http,private router: Router,userdata:CookieService, private _commonservices: Commonservices) {
    this.fb = fb;
    this.commonservices=_commonservices;
    this.items = _commonservices.getItems();
    this.serverUrl = this.items[0].serverUrl;
    this.userdata = userdata;
    //console.log(this.userdata);
    console.log(this.userdata);
    this.userdetails=this.userdata.getObject('userdetails');
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

  showerrorcls(cntrlname,type='required'){
    if(!this.dataForm.controls[cntrlname].valid && this.isSubmit)
      return '';



    return 'hide';
  }

  dosubmit(formval){

    this.is_error = 0;

    this.isSubmit = true;

    if(this.dataForm.valid){

      var link =this.serverUrl+'adminlogin';
      //var link = 'http://influxiq.com:3001/adminlogin';
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

              this.router.navigate(['/login(header:admin_header)']);
            }

          }, error => {
            console.log("Oooops!");
          });



    }
  }
}
