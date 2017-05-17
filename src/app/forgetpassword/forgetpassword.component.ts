import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Http} from "@angular/http";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
import {Commonservices} from "../app.commonservices";
@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css'],
  providers: [Commonservices]
})

export class ForgetpasswordComponent implements OnInit {
  public dataForm: FormGroup;
  private fb;
  private isemailvalidate;
  private isSubmit;
  private userdata:CookieService;
  private userdetails;
  public is_error;
  items:any;
  serverUrl:any;
  commonservices:Commonservices;

  constructor(fb: FormBuilder, private _http: Http, private router: Router, userdata:CookieService, private _commonservices: Commonservices) {
    this.fb = fb;
    this.userdata = userdata;
    this.userdetails=this.userdata.getObject('email');
    this.commonservices=_commonservices;
    this.items = _commonservices.getItems();
    this.serverUrl = this.items[0].serverUrl;
  }

  ngOnInit() {
    this.isSubmit = false;
    this.dataForm = this.fb.group({
      email: ["", Validators.required],
    });

  }

  haserrorcls(cntrlname) {
    if (cntrlname == 'email' && this.isSubmit) {
      if (this.dataForm.controls[cntrlname].valid) {
        let emailval = this.dataForm.controls[cntrlname].value;
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailval)) {
          return '';
        } else {
          return 'has-error';
        }
      }
    }
    if (!this.dataForm.controls[cntrlname].valid && this.isSubmit)
      return 'has-error';

    return '';
  }
  showerrorcls(cntrlname, type = 'reuired') {
    if (cntrlname == 'email' && type == 'validemail' && this.isSubmit) {
      if (this.dataForm.controls[cntrlname].valid) {
        let emailval = this.dataForm.controls[cntrlname].value;
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailval)) {
          return 'hide';
        } else {
          return '';
        }
      } else {
        return 'hide';
      }
    }

    if (!this.dataForm.controls[cntrlname].valid && this.isSubmit)
      return '';


    return 'hide';
  }


  dosubmit(formval) {
    this.is_error = 0;
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.dataForm.controls['email'].value)) {
      this.isemailvalidate = true;
    }

    this.isSubmit = true;
    if (this.dataForm.valid && this.isemailvalidate) {
      //console.log(formval.email);
      var link =this.serverUrl+'forgetpassword';
      //var link = 'http://influxiq.com:3001/forgetpassword';
      var data = {email: formval.email};
      this._http.post(link, data)
          .subscribe(res => {
            var result = res.json();
            //console.log(result.msg);
            //console.log(result.status);
            if(result.status=='success') {
              this.userdata.putObject('email', result.msg);
              this.router.navigate(['/accesscode']);
            }
            else {

              this.is_error=result.msg;

              this.router.navigate(['/forgetpassword']);
            }

          }, error => {
            console.log("Oooops!");
          });
    }

  }
}