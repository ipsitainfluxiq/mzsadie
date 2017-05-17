import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl,FormBuilder} from '@angular/forms';
import {Http} from "@angular/http";
import { Router, ActivatedRoute} from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
import {Commonservices} from "../app.commonservices";
@Component({
  selector: 'app-addreview',
  templateUrl: './addreview.component.html',
  styleUrls: ['./addreview.component.css'],
  providers: [Commonservices]
})
export class AddreviewComponent implements OnInit {
  id:number;
  public userdata2;
  coockieData:CookieService;
  public adminid;
  public dt;
  public dataForm: FormGroup;
  private fb;
  private isSubmit;
  commonservices:Commonservices;
  public ckeditorContent:any;
  serverUrl:any;
  items:any;
  constructor(fb: FormBuilder, private _http: Http,private router: Router, private route: ActivatedRoute, userdetails:CookieService,  private _commonservices: Commonservices) {
    this.fb = fb;
    this.coockieData=userdetails;
    this.userdata2 = userdetails.getObject('userdetails');
    this.adminid= this.userdata2._id;
    console.log(this.adminid);
    //this.dt= new Date().toLocaleString();
    this.commonservices=_commonservices;
    this.items = _commonservices.getItems();
    this.serverUrl = this.items[0].serverUrl;
  }

  ngOnInit() {
    this.isSubmit=false;
    this.ckeditorContent = '';
    this.route.params.subscribe(params => {
      this.id = params['id'];
    },error=>{
      console.log(error);
      this.router.navigate(['/employeelist']);
    });


    this.dataForm= this.fb.group({
      review: ["", Validators.required],
    });
  }
  onChange(event:any){
    this.dataForm.patchValue({review: this.ckeditorContent});
    //console.log('review value updated');

  }

  haserrorcls(cntrlname) {
    if (cntrlname == 'review' && this.isSubmit) {
      if (this.dataForm.controls[cntrlname].valid) {
          return '';
        } else {
          return 'has-error';
        }
      }

    if (!this.dataForm.controls[cntrlname].valid && this.isSubmit)
      return 'has-error';

    return '';
  }

  showerrorcls(cntrlname, type = 'reuired') {
    if (cntrlname == 'review' && this.isSubmit) {
      if (this.dataForm.controls[cntrlname].valid) {
        return 'hide';
      } else {
        return '';
      }
    }
    if (!this.dataForm.controls[cntrlname].valid && this.isSubmit)
      return '';
    return 'hide';
  }

  dosubmit(formval) {
    this.isSubmit = true;
    if (this.dataForm.valid) {
      var link =this.serverUrl+'addreviewdetails';
       //var link = 'http://influxiq.com:3001/reviewdetails';
      var data = {_idemp : this.id, _idadmin : this.adminid, review: formval.review};
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
