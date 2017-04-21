import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl,FormBuilder} from '@angular/forms';    //To add form import these
import {Http} from "@angular/http";
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-addadmin',
  templateUrl: './addadmin.component.html',
  styleUrls: ['./addadmin.component.css']
})
export class AddadminComponent implements OnInit {
    public dataForm: FormGroup;
    private fb;

    private isSubmit;
    private isemailvalidate;
    private passmatchvalidate;

    constructor(fb: FormBuilder, private _http: Http, private router: Router) {
        this.fb = fb;
    }


    ngOnInit() {
        this.isSubmit = false;
        this.isemailvalidate = false;
        this.passmatchvalidate = false;

        this.dataForm = this.fb.group({
            firstname: ["", Validators.required],
            lastname: ["", Validators.required],
            email: ["", Validators.required],
            password: ["", Validators.compose([Validators.required, Validators.minLength(8)])],
            confpassword: ["", Validators.required],
            address: ["", Validators.required],
            city: ["", Validators.required],
            state: ["", Validators.required],
            zip: ["", Validators.required],
            phone: [""],
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

        if (cntrlname == 'password' && this.isSubmit) {
            if (!this.dataForm.controls[cntrlname].valid) {
                if (type == 'required') {
                    if (this.dataForm.controls[cntrlname].hasError('required')) {
                        return '';
                    } else {
                        return 'hide';
                    }
                }
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

        if (this.dataForm.controls['password'].value == this.dataForm.controls['confpassword'].value) {
            this.passmatchvalidate = true;
        }

        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.dataForm.controls['email'].value)) {
            this.isemailvalidate = true;
        }

        this.isSubmit = true;
        if (this.dataForm.valid && this.isemailvalidate && this.passmatchvalidate) {
            var link = 'http://influxiq.com:3001/addadmin';
            var data = {
                firstname: formval.firstname,
                lastname: formval.lastname,
                email: formval.email,
                password: formval.password,
                phone: formval.phone,
                address: formval.address,
                city: formval.city,
                state: formval.state,
                zip: formval.zip
            };
            this._http.post(link, data)
                .subscribe(res => {
                    this.router.navigate(['/adminlist']);
                }, error => {
                    console.log("Oooops!");
                });
        }
    }


}