import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Http} from "@angular/http";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
@Component({
  selector: 'app-accesscode',
  templateUrl: './accesscode.component.html',
  styleUrls: ['./accesscode.component.css']
})
export class AccesscodeComponent implements OnInit {
  private dataForm: FormGroup;
  private fb;
  private isSubmit;
  private userdata: CookieService;
  private emailid2;
  private useremai: any;
  public userdata2: any;
  public is_error;
  constructor(fb: FormBuilder, private _http: Http, private router: Router, userdata: CookieService) {
    this.fb = fb;
    let userdata2: any;
    this.userdata2 = userdata.getObject('email');
    // console.log(this.userdata2);
    /*    console.log(userdata2);
     console.log("yh");*/
    /*this.emailid2 = emailid1._id;*/

    //console.log(userdata2);
  }


  ngOnInit() {
    this.isSubmit = false;
    this.dataForm = this.fb.group({
      accesscode: ["", Validators.required],
    });
  }

  haserrorcls(cntrlname) {
    if (!this.dataForm.controls[cntrlname].valid && this.isSubmit)
      return 'has-error';

    return '';
  }

  showerrorcls(cntrlname, type = 'required') {
    if (!this.dataForm.controls[cntrlname].valid && this.isSubmit)
      return '';


    return 'hide';
  }

   dosubmit(formval) {
   this.isSubmit = true;
   if (this.dataForm.valid) {
   var link = 'http://influxiq.com:3001/accesscodecheck';
    var data = {email:this.userdata2, accesscode: formval.accesscode};
   this._http.post(link, data)
   .subscribe(res => {
   var result = res.json();

   if(result.status=='success') {
   this.router.navigate(['/newpassword']);
   }
   else {
       this.is_error=result.msg;
   this.router.navigate(['/accesscode']);
   }

   }, error => {
   console.log("Oooops!");
   });

   }


   }

}