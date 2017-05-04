import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Http} from "@angular/http";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit {
  public dataForm:FormGroup;
  private fb;

  private isSubmit;
  private isemailvalidate;
  public error_msg;
  public passmatchvalidate;
  public alphanpassvalidate;
  public userid;
  public time;
  public oldpassword;
  constructor(fb: FormBuilder,private _http: Http,private router: Router,userdata:CookieService, private route: ActivatedRoute) {
    this.fb = fb;
  }

  ngOnInit() {
    this.isSubmit = false;
    this.isemailvalidate = false;
    this.passmatchvalidate = false;
    this.alphanpassvalidate = false;

    this.dataForm = this.fb.group({
      password: ["", Validators.required],
      confpassword: ["", Validators.required],
    });

    this.route.params.subscribe(params => {
      this.userid = params['id'];
    },error=>{
      this.router.navigate(['/admin-list']);
    });
  }
  showerrorcls(cntrlname,type='reuired'){

    if(cntrlname == 'password' && type == 'alphanumeric2' && this.isSubmit){
      if(this.dataForm.controls[cntrlname].valid){
        let passval = this.dataForm.controls[cntrlname].value;
        let validerror = 0;
        if(passval.length<8){
          validerror=1;
        }

        if(passval.replace(/[^A-Z]/g, "").length<1){
          validerror=1;
        }

        if(passval.replace(/[^a-z]/g, "").length<1){
          validerror=1;
        }

        if(passval.replace(/[^0-9]/g, "").length<1){
          validerror=1;
        }

        if(passval.replace(/[^!@#$%^&*()_+]/g, "").length<1){
          validerror=1;
        }

        if(validerror == 0){
          return 'hide';
        }else{
          return '';
        }

      }else {
        return 'hide';
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
    this.passmatchvalidate = false;
    this.alphanpassvalidate = false;

    if(this.dataForm.controls['password'].value == this.dataForm.controls['confpassword'].value){
      this.passmatchvalidate = true;
    }

    let passval = this.dataForm.controls['password'].value;
    let validerror = 0;

    if(passval != ''){
      let validerror = 0;
      if(passval.length<8){
        validerror=1;
      }

      if(passval.replace(/[^A-Z]/g, "").length<1){
        validerror=1;
      }

      if(passval.replace(/[^a-z]/g, "").length<1){
        validerror=1;
      }

      if(passval.replace(/[^0-9]/g, "").length<1){
        validerror=1;
      }

      if(passval.replace(/[^!@#$%^&*()_+]/g, "").length<1){
        validerror=1;
      }

      if(validerror == 0){
        this.alphanpassvalidate = true;
      }
    }

    this.isSubmit = true;

    if(this.dataForm.valid && this.passmatchvalidate && this.alphanpassvalidate){

      var link = 'http://influxiq.com:3001/resetpassword';
      var data = {userid:this.userid, password: formval.password};

console.log(data);
      this._http.post(link, data)
          .subscribe(res => {
            //console.log("Hi");
            var result = res.json();
            //console.log(result.status);
            if(result.status == 'error'){
              this.error_msg = result.msg;
            }else{
            setTimeout(() => {
              this.router.navigate(['/admin_login']);

              },2000);

            }

          }, error => {
            console.log("Oooops!");
          });
   }


  }

}
