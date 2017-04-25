import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Http} from "@angular/http";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
@Component({
  selector: 'app-newpassword',
  templateUrl: './newpassword.component.html',
  styleUrls: ['./newpassword.component.css']
})
export class NewpasswordComponent implements OnInit {
  public dataForm:FormGroup;
  private fb;
  private isSubmit;
  private passmatchvalidate;
  public is_error;
  private userdata: CookieService;
  public userdata2: any;
  coockieData:CookieService;
  constructor(fb: FormBuilder,private _http: Http,private router: Router, userdata: CookieService) {
    this.fb = fb;
    let userdata2: any;
    this.userdata2 = userdata.getObject('email');
    this.coockieData=this.userdata2;
  }

  ngOnInit() {
    this.isSubmit = false;
    this.passmatchvalidate = false;
    this.dataForm = this.fb.group({
      password: ["", Validators.compose([Validators.required, Validators.minLength(8)])],
      confpassword: ["", Validators.required],

    });
  }
  haserrorcls(cntrlname){

    if(cntrlname == 'confpassword' && this.isSubmit){
      if(this.dataForm.controls[cntrlname].valid) {
        if(this.dataForm.controls['password'].value == this.dataForm.controls['confpassword'].value){
          return '';
        }else{
          return 'has-error';
        }
      }
    }


    if(!this.dataForm.controls[cntrlname].valid && this.isSubmit)
      return 'has-error';

    return '';
  }

  showerrorcls(cntrlname,type='reuired'){

    if(cntrlname == 'password' && this.isSubmit){
      if(!this.dataForm.controls[cntrlname].valid){
        if(type == 'required'){
          if(this.dataForm.controls[cntrlname].hasError('required')){
            return '';
          }else {
            return 'hide';
          }
        }
      }
    }

    if(cntrlname == 'confpassword' && type == 'match' && this.isSubmit){
      if(this.dataForm.controls[cntrlname].valid){
        if(this.dataForm.controls['password'].value == this.dataForm.controls['confpassword'].value){
          return 'hide';
        }else{
          return '';
        }
      }else {
        return 'hide';
      }
    }


    if(!this.dataForm.controls[cntrlname].valid && this.isSubmit)
      return '';



    return 'hide';
  }
  dosubmit(formval){

    this.is_error =0;
    this.passmatchvalidate = false;
    if(this.dataForm.controls['password'].value == this.dataForm.controls['confpassword'].value){
      this.passmatchvalidate = true;
    }
    this.isSubmit =true;
    if(this.dataForm.valid && this.passmatchvalidate){
      var link= 'http://influxiq.com:3001/newpassword';
      var data = {email:this.userdata2, password: formval.password,confirmpassword: formval.confpassword,};

      this._http.post(link, data)
          .subscribe(res => {
            var result = res.json();
            if(result.status=='success') {
              //console.log(this.coockieData);
             // this.coockieData.removeAll();
              this.router.navigate(['/admin_login']);
            }
            else{

              this.is_error=result.msg;
            }
          }, error => {
            console.log("Oooops!");
          });
    }


  }


}
