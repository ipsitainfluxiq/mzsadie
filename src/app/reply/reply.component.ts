import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl,FormBuilder} from '@angular/forms';
import {Http} from "@angular/http";
import { Router, ActivatedRoute} from '@angular/router';
import {CookieService} from 'angular2-cookie/core';
import {Commonservices} from "../app.commonservices";
@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css'],
  providers: [Commonservices]
})
export class ReplyComponent implements OnInit {
  id:number;
  employeeid:number;
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
    //console.log(this.adminid);
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
      this.employeeid = params['employeeid'];
      console.log(this.employeeid);
    },error=>{
      console.log(error);
      this.router.navigate(['/employeelist']);
    });


    this.dataForm= this.fb.group({
      reply: ["", Validators.required],
    });
  }
  onChange(event:any){
    this.dataForm.patchValue({reply: this.ckeditorContent});

  }
  haserrorcls(cntrlname) {
    if (cntrlname == 'reply' && this.isSubmit) {
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
    if (cntrlname == 'reply' && this.isSubmit) {
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
      var link =this.serverUrl+'addreplydetails';

      var data = {_idrev : this.id, _idadmin : this.adminid, reply: formval.reply, employeeid: this.employeeid};
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
