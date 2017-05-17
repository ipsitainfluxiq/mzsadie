import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Http} from "@angular/http";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
import {Commonservices} from "../app.commonservices";
@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css'],
  providers: [Commonservices]
})
export class ChangepasswordComponent implements OnInit {
  public dataForm:FormGroup;
  private fb;
  private adminid;
  private isSubmit;
  private admindata:CookieService;
  public admindetails:any;
  private passmatchvalidate;
  public is_error;
  items:any;
  serverUrl:any;
  commonservices:Commonservices;

  constructor(fb: FormBuilder,private _http: Http,private router: Router,admindata:CookieService, private _commonservices: Commonservices) {
    this.fb = fb;
    this.commonservices=_commonservices;
    this.items = _commonservices.getItems();
    this.serverUrl = this.items[0].serverUrl;
    let admindata2: any;
    admindata2= admindata.getObject('userdetails');

    if (typeof (admindata2) == 'undefined') {
      this.router.navigateByUrl('/login');
    } else {
      this.adminid = admindata2._id;
      console.log(this.adminid);
    }
  }

  ngOnInit() {

    this.isSubmit = false;
    this.passmatchvalidate = false;
    this.dataForm = this.fb.group({
      oldpassword: ["", Validators.required],
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
      //console.log(formval);
      var link =this.serverUrl+'changepassword';
      //var link= 'http://influxiq.com:3001/changepassword';
      var data = {id: this.adminid,oldpassword: formval.oldpassword,password: formval.password,confirmpassword: formval.confpassword,};

      this._http.post(link, data)
          .subscribe(res => {
            var result = res.json();
            if(result.status=='success') {

              this.router.navigate(['/adminprofile']);
            }
            else{

//console.log(result.msg);

              this.is_error=result.msg;
            }
          }, error => {
            console.log("Oooops!");
          });
    }


  }


}
