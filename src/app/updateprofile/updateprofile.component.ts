import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl} from '@angular/forms';
import {Http} from "@angular/http";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
@Component({
  selector: 'app-updateprofile',
  templateUrl: './updateprofile.component.html',
  styleUrls: ['./updateprofile.component.css']
})
export class UpdateprofileComponent implements OnInit {

  public dataForm:FormGroup;
  private fb;
  private adminid;
  private isSubmit;
  private admindata:CookieService;
  public admindetails:any;


  constructor(fb: FormBuilder,private _http: Http,private router: Router,admindata:CookieService) {
    this.fb = fb;

    let admindata2: any;
    admindata2= admindata.getObject('userdetails');

    if (typeof (admindata2) == 'undefined') {
      this.router.navigateByUrl('/login');
    } else {
      this.adminid = admindata2._id;
      console.log(this.adminid);
      this.getAdminDetails();
    }
  }

  ngOnInit() {

    this.isSubmit = false;

    this.dataForm = this.fb.group({
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      email: ["", Validators.required],
      address: ["", Validators.required],
      city: ["", Validators.required],
      state: ["", Validators.required],
      zip: ["", Validators.required],
      phone: [""],

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




  getAdminDetails(){

    var link = 'http://influxiq.com:3001/admindetails';
    var data = {_id: this.adminid};

    this._http.post(link, data)
        .subscribe(res => {
          var result = res.json();

          console.log(result);

          if (result.status == 'success' && typeof(result.item) != 'undefined') {
            let userdet = result.item;
            /*this.admindetails = userdet;
            console.log(this.admindetails);*/
            (<FormControl>this.dataForm.controls['firstname']).setValue(userdet.firstname);
            (<FormControl>this.dataForm.controls['lastname']).setValue(userdet.lastname);
            (<FormControl>this.dataForm.controls['email']).setValue(userdet.email);
            (<FormControl>this.dataForm.controls['phone']).setValue(userdet.phone);
            (<FormControl>this.dataForm.controls['address']).setValue(userdet.address);
            (<FormControl>this.dataForm.controls['city']).setValue(userdet.city);
            (<FormControl>this.dataForm.controls['state']).setValue(userdet.state);
            (<FormControl>this.dataForm.controls['zip']).setValue(userdet.zip);


          }else{
            this.router.navigateByUrl('/admin_dashboard(header:admin_header)');
          }

        }, error => {
          console.log("Oooops!");
        });
  }

  dosubmit(formval){
    this.isSubmit = true;
    if(this.dataForm.valid){
      var link= 'http://influxiq.com:3001/updateprofile';
      var data = {id: this.adminid,firstname: formval.firstname,lastname: formval.lastname,email: formval.email,password: formval.password,phone: formval.phone,address: formval.address,city: formval.city,state: formval.state,zip: formval.zip};
      console.log(data);
      this._http.post(link, data)
          .subscribe(data => {
            this.router.navigate(['/admin_dashboard']);
          }, error => {
            console.log("Ooooooops!");
          });
    }





  }


}
