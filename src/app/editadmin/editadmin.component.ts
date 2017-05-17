import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl,FormBuilder} from '@angular/forms';    //To add form import these
import {Http} from "@angular/http";
import { Router, ActivatedRoute, Params } from '@angular/router';
//import {Editadmin} from "../editadmin.service";
import {Commonservices} from "../app.commonservices";

@Component({
  selector: 'app-editadmin',
  templateUrl: './editadmin.component.html',
  styleUrls: ['./editadmin.component.css'],
  //providers: [Editadmin]
  providers: [Commonservices]
})
export class EditadminComponent implements OnInit {
  public dataForm:FormGroup;
  private fb;
  private isSubmit;
  id:number;


  items:any;
  serverUrl:any;
  commonservices:Commonservices;
  constructor(fb: FormBuilder,private _http: Http,private router: Router, private route: ActivatedRoute, private _commonservices: Commonservices/*private _editadmin: Editadmin*/) {
    this.fb = fb;
    this.commonservices=_commonservices;
    this.items = _commonservices.getItems();
    this.serverUrl = this.items[0].serverUrl;
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      //console.log(this.id);
      this.getUserdetails();
    },error=>{
      this.router.navigate(['/adminlist']);
    });

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


  getUserdetails(){


     var link =this.serverUrl+'admindetails';


    //var link = 'http://influxiq.com:3001/admindetails';
    var data = {_id : this.id};

    this._http.post(link, data)
        .subscribe(res => {
         // console.log(res);
          var result = res.json();
          console.log(result);
          console.log(result.status);
          if(result.status == 'success' && typeof(result.item) != 'undefined'){
            //console.log(result);
            let userdet = result.item;
            //console.log(userdet.firstname);
            //(<FormControl>this.dataForm.controls['id']).setValue(userdet._id);
            (<FormControl>this.dataForm.controls['firstname']).setValue(userdet.firstname);
            (<FormControl>this.dataForm.controls['lastname']).setValue(userdet.lastname);
            (<FormControl>this.dataForm.controls['email']).setValue(userdet.email);
            (<FormControl>this.dataForm.controls['phone']).setValue(userdet.phone);
            (<FormControl>this.dataForm.controls['address']).setValue(userdet.address);
            (<FormControl>this.dataForm.controls['city']).setValue(userdet.city);
            (<FormControl>this.dataForm.controls['state']).setValue(userdet.state);
            (<FormControl>this.dataForm.controls['zip']).setValue(userdet.zip);
          }else{
            this.router.navigate(['/adminlist']);
          }
        }, error => {
          console.log("Oooops!");
        });
  }

  dosubmit(formval){
    //console.log(this.id);
    this.isSubmit = true;
    //console.log(this.dataForm);
    if(this.dataForm.valid){
      //this._editadmin.editValue(this.dataForm,this.id).subscribe(res => {
      this._commonservices.editValue(this.dataForm,this.id).subscribe(res => {
        //console.log(res);
        this.router.navigate(['/adminlist']);
      }, error => {
        console.log("Oooops!");
      });
    /*var link= 'http://influxiq.com:3001/editadmin';
    var data = {id: this.id,firstname: formval.firstname,lastname: formval.lastname,email: formval.email,password: formval.password,phone: formval.phone,address: formval.address,city: formval.city,state: formval.state,zip: formval.zip};
    console.log(data);
      this._http.post(link, data)
          .subscribe(data => {
            this.router.navigate(['/adminlist']);
          }, error => {
            console.log("Oooops!");
          });*/
  }





}
}
