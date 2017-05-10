import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl,FormBuilder} from '@angular/forms';    // import these to add form
import {Http} from "@angular/http";
import { Router, ActivatedRoute, Params } from '@angular/router';
//declare var $:any;

@Component({
  selector: 'app-addemployee',
  templateUrl: './addemployee.component.html',
  styleUrls: ['./addemployee.component.css']
})
export class AddemployeeComponent implements OnInit {
  public dataForm: FormGroup;
  private fb;
  private isSubmit;
  private isemailvalidate;
  private isvivacity;
  private passmatchvalidate;
  public ckeditorContent:any;
  id:number;
  public is_error;
  public userdata: any;
  constructor(fb: FormBuilder, private _http: Http, private router: Router,private route: ActivatedRoute) {
    this.fb = fb;
  }

  ngOnInit() {
    this.isSubmit = false;
    this.isemailvalidate = false;
    this.isvivacity = false;
    this.passmatchvalidate = false;
    this.ckeditorContent = '';

    this.dataForm = this.fb.group({
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      email: ["", Validators.required],
      password: ["", Validators.compose([Validators.required, Validators.minLength(8)])],
      confpassword: ["", Validators.required],
      designation: ["", Validators.required],
      note: ['', Validators.required],

    });
  }
  onChange(event:any){
    this.dataForm.patchValue({designation: this.ckeditorContent});
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
    if (cntrlname == 'confpassword' && this.isSubmit) {
      if (this.dataForm.controls[cntrlname].valid) {
        if (this.dataForm.controls['password'].value == this.dataForm.controls['confpassword'].value) {
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


    if (cntrlname == 'confpassword' && type == 'match' && this.isSubmit) {
      if (this.dataForm.controls[cntrlname].valid) {
        if (this.dataForm.controls['password'].value == this.dataForm.controls['confpassword'].value) {
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
//console.log("hi");
    if (this.dataForm.controls['password'].value == this.dataForm.controls['confpassword'].value) {
      this.passmatchvalidate = true;
    }

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.dataForm.controls['email'].value)) {
      this.isemailvalidate = true;
    }
//console.log(this.dataForm.valid);
    this.isSubmit = true;
    if (this.dataForm.valid && this.isemailvalidate && this.passmatchvalidate) {
      console.log("inside dataform");
      var link = 'http://influxiq.com:3001/addemployee';
      var data = {
        firstname: formval.firstname,
        lastname: formval.lastname,
        email: formval.email,
        password: formval.password,
        designation: formval.designation,
        note: formval.note,
      };
      console.log(data);
      this._http.post(link, data)
          .subscribe(res => {
            this.router.navigate(['/employeelist']);
          }, error => {
            console.log("Oooops!");
          });
    }
  }
}
