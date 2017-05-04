import {Component, NgZone, OnInit} from '@angular/core';
import { FormGroup, Validators, FormControl,FormBuilder} from '@angular/forms';    //To add form import these
import {Http} from "@angular/http";
import { Router, ActivatedRoute, Params } from '@angular/router';
declare var $:any;


@Component({
  selector: 'app-addaces',
  templateUrl: './addaces.component.html',
  styleUrls: ['./addaces.component.css']
})
export class AddacesComponent implements OnInit {
  private zone: NgZone;
  private basicOptions: Object;
  public progress: number = 0;
  private response: any = {};

  public dataForm: FormGroup;
  private fb;
  private isSubmit;
  private isemailvalidate;
  private isvivacity;
  private passmatchvalidate;
  public uploadedfilesrc:any;
  public ckeditorContent:any;
  id:number;
  public is_error;
  public imagename: any;
  public userdata: any;
  private minlength;
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
      bio: ["", Validators.required],
      image: ['', Validators.required],
      vivacityurl: ['', Validators.required],

    });

    this.zone = new NgZone({ enableLongStackTrace: false });
    this.basicOptions = {
      url: 'http://influxiq.com:3001/uploads'
    };

/*    this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log(this.id);
    });*/
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
              this.uploadedfilesrc = "http://mzsadie.influxiq.com/uploads/" + result.filename;
              this.imagename=result.filename;
            }
         }



         /*if(resp.error_code == 0){
            this.dataForm.patchValue({image: resp.filename});
           this.uploadedfilesrc = "http://influxiq.com:3001/uploads/" + resp.filename;
         }*/


       }
     });
   }

  onChange(event:any){
    this.dataForm.patchValue({bio: this.ckeditorContent});

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



      if (cntrlname == 'vivacityurl' && this.isSubmit) {
        if (this.dataForm.controls[cntrlname].valid) {
          var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
          if (regex.test(cntrlname)) {
            this.isvivacity = true;
            return '';
          } else {
            //alert("Please enter valid URL.");

            return 'has-error';
          }
        }
      }



    /*      var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
              '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
              '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
              '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
              '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
              '(\#[-a-z\d_]*)?$','i'); // fragment locater
          if(!pattern.test(cntrlname)) {
            alert("Please enter a valid URL.");
            return 'has-error';
          } else {
            return '';
          }*/





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

    if (cntrlname == 'vivacityurl' && this.isSubmit) {
      if (this.dataForm.controls[cntrlname].valid) {
      var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

      if (!regex.test(cntrlname)) {
        //alert("Please enter valid URL.");
console.log("test failed");
        return '';

      } else {
        this.isvivacity = true;
//console.log("True1");
        return 'hide';
      }
    } else {
        this.isvivacity = true;
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
//console.log(this.dataForm.valid);
//console.log(this.isvivacity);
    this.isSubmit = true;
    if (this.dataForm.valid && this.isemailvalidate && this.passmatchvalidate && this.isvivacity) {
      //console.log("inside dataform");
      var link = 'http://influxiq.com:3001/addaces';
      var data = {
        firstname: formval.firstname,
        lastname: formval.lastname,
        email: formval.email,
        password: formval.password,
        //bio: formval.description,
        bio: formval.bio,
        image: formval.image,
        vivacityurl: formval.vivacityurl,
      };
      console.log(data);
      this._http.post(link, data)
          .subscribe(res => {
            this.router.navigate(['/aceslist']);
          }, error => {
            console.log("Oooops!");
          });
    }
  }
deleteimage(imagename:any){
    console.log(imagename);

  var link ='http://influxiq.com:3001/deleteimage';
  var data = {id:'',image:imagename};
  //console.log(data);

  this._http.post(link, data)
      .subscribe(res => {
        var result = res.json();
        //var result = res;

        if(result.status=='success')
        {
          console.log('Image Deleted');
          this.uploadedfilesrc='';
          this.progress =0;

          this.is_error=1;
        }

      }, error => {
        console.log("Oooops!");
      });

}

}
