import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl,FormBuilder} from '@angular/forms';    //To add form import these
import {Http} from "@angular/http";
import { Router, ActivatedRoute} from '@angular/router';
import {Commonservices} from "../app.commonservices";
@Component({
  selector: 'app-editemployee',
  templateUrl: './editemployee.component.html',
  styleUrls: ['./editemployee.component.css'],
  providers: [Commonservices]
})
export class EditemployeeComponent implements OnInit {
  public dataForm:FormGroup;
  private fb;
  public ckeditorContent:any;
  private isSubmit;
  public userdata: any;
  id:number;
  public is_error;
  items:any;
  serverUrl:any;
  commonservices:Commonservices;
  constructor(fb: FormBuilder,private _http: Http,private router: Router, private route: ActivatedRoute, private _commonservices: Commonservices) {
    this.fb = fb;
    this.commonservices=_commonservices;
    this.items = _commonservices.getItems();
    this.serverUrl = this.items[0].serverUrl;
  }

  ngOnInit() {
    this.is_error=0;
    this.ckeditorContent = '';
    this.route.params.subscribe(params => {
      this.id = params['id'];
      this.getEmployeeList();
    },error=>{
      this.router.navigate(['/employeelist']);
    });

    this.isSubmit = false;

    this.dataForm = this.fb.group({
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      email: ["", Validators.required],
      designation: ["", Validators.required],
      note: ['', Validators.required],

    });
  }
  onChange(event:any){
    this.dataForm.patchValue({note: this.ckeditorContent});

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

  getEmployeeList(){
    var link =this.serverUrl+'employeedetails';
   // var link = 'http://influxiq.com:3001/employeedetails';
    var data = {_id : this.id};
//console.log(data);
    this._http.post(link, data)
        .subscribe(res => {

          var result = res.json();
          //console.log(result.status);

          if(result.status == 'success' && typeof(result.item) != 'undefined'){
            //console.log(result);
            let userdet = result.item;
            this.userdata=userdet;
            (<FormControl>this.dataForm.controls['firstname']).setValue(userdet.firstname);
            (<FormControl>this.dataForm.controls['lastname']).setValue(userdet.lastname);
            (<FormControl>this.dataForm.controls['email']).setValue(userdet.email);
            (<FormControl>this.dataForm.controls['designation']).setValue(userdet.designation);
            (<FormControl>this.dataForm.controls['note']).setValue(userdet.note);

          }else{
            this.router.navigate(['/employeelist']);
          }
        }, error => {
          console.log("Oooops!");
        });
  }
  dosubmit(formval){
    //this.is_error=0;
    this.isSubmit = true;
    if(this.dataForm.valid){
      var link =this.serverUrl+'editemployee';
      //var link= 'http://influxiq.com:3001/editemployee';
      var data = {id: this.id,firstname: formval.firstname,lastname: formval.lastname,email: formval.email,designation: formval.designation,note: formval.note};
      console.log(data);
      this._http.post(link, data)
          .subscribe(data => {
            this.router.navigate(['/employeelist']);
          }, error => {
            console.log("Oooops!");
          });
    }

  }

}
