import { Component, NgZone, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl,FormBuilder} from '@angular/forms';    //To add form import these
import {Http} from "@angular/http";
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-editaces',
  templateUrl: './editaces.component.html',
  styleUrls: ['./editaces.component.css']
})
export class EditacesComponent implements OnInit {
  private zone: NgZone;
  public basicOptions: Object;
  private progress: number = 0;
  private response: any = {};
  public uploadedfilesrc:any;
  //public datal;
  public dataForm:FormGroup;
  private fb;
  public ckeditorContent:any;
  private isSubmit;
  public imgsrc:any;
  public userdata: any;
  id:number;
  public is_error;
  constructor(fb: FormBuilder,private _http: Http,private router: Router, private route: ActivatedRoute) {
    this.fb = fb;
  }

  ngOnInit() {
    this.is_error=0;
    this.ckeditorContent = '';
    this.route.params.subscribe(params => {
      this.id = params['id'];
      //console.log(this.id);
      this.getAcesList();
    },error=>{
      this.router.navigate(['/aceslist']);
    });

    this.isSubmit = false;

    this.dataForm = this.fb.group({
      firstname: ["", Validators.required],
      lastname: ["", Validators.required],
      email: ["", Validators.required],
      bio: ["", Validators.required],
      image: [""],
      vivacityurl: ['', Validators.required],

    });
    this.zone = new NgZone({ enableLongStackTrace: false });
    this.basicOptions = {
      url: 'http://influxiq.com:3001/uploads'
    };
  }

  handleUpload(data: any): void
  {

    this.zone.run(() => {

      this.response = data;

      this.progress = data.progress.percent ;
      if(data.progress.percent==100){

        var resp = data.response;

        if(typeof (resp) != 'undefined'){
          var result = JSON.parse(data.response);
          if(result.error_code == 0){
            this.dataForm.patchValue({image: result.filename});
            this.imgsrc = "http://mzsadie.influxiq.com/uploads/" + result.filename;
            this.is_error=0   ;
          }
        }

      }
    });
  }

  onChange(event:any){
    //this.dataForm.patchValue({description: this.ckeditorContent});
    this.dataForm.patchValue({bio: this.ckeditorContent});

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

  getAcesList(){
    var link = 'http://influxiq.com:3001/acesdetails';
    var data = {_id : this.id};
//console.log(data);
    this._http.post(link, data)
        .subscribe(res => {

          var result = res.json();
          //console.log(result.status);

          if(result.status == 'success' && typeof(result.item) != 'undefined'){
            //console.log(result);
            let userdet = result.item;
            //this.imgsrc = "/home/influxiq/public_html/projects/mzsadie/uploads/" +userdet.image;
            this.imgsrc='http://mzsadie.influxiq.com/uploads/'+userdet.image;
            //console.log(userdet);
            this.userdata=userdet;
            (<FormControl>this.dataForm.controls['firstname']).setValue(userdet.firstname);
            (<FormControl>this.dataForm.controls['lastname']).setValue(userdet.lastname);
            (<FormControl>this.dataForm.controls['email']).setValue(userdet.email);
            (<FormControl>this.dataForm.controls['bio']).setValue(userdet.bio);
            (<FormControl>this.dataForm.controls['image']).setValue(userdet.image);
            (<FormControl>this.dataForm.controls['vivacityurl']).setValue(userdet.vivacityurl);
            //console.log(this.dataForm.controls['image'].value);


            if(userdet.image==""){this.is_error=1}; //No image =1



          }else{
            this.router.navigate(['/aceslist']);
          }
        }, error => {
          console.log("Oooops!");
        });
  }

  dosubmit(formval){
    //this.is_error=0;
    this.isSubmit = true;
    if(this.dataForm.valid){
      var link= 'http://influxiq.com:3001/editaces';
      var data = {id: this.id,firstname: formval.firstname,lastname: formval.lastname,email: formval.email,bio: formval.bio,image: formval.image,vivacityurl: formval.vivacityurl};
      console.log(data);
      this._http.post(link, data)
          .subscribe(data => {
            this.router.navigate(['/aceslist']);
          }, error => {
            console.log("Oooops!");
          });
    }

  }


  deleteimage(){

    //console.log(this.dataForm.controls['image']);
    var link ='http://influxiq.com:3001/deleteimage';
    var data = {id:this.id,image:this.userdata.image};
    this._http.post(link, data)
        .subscribe(res => {
          var result = res.json();
          //var result = res;

          if(result.status=='success')
          {
          console.log('Image Deleted');
          this.is_error=1;
          }
          /*this.getAcesList();*/
        }, error => {
          console.log("Oooops!");
        });
  }

}
