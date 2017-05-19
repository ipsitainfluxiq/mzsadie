import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import { Router, ActivatedRoute} from '@angular/router';
import {DomSanitizer} from "@angular/platform-browser";
import {CookieService} from 'angular2-cookie/core';
import {Commonservices} from "../app.commonservices";
declare var $:any;
@Component({
  selector: 'app-viewlogindetails',
  templateUrl: './viewlogindetails.component.html',
  styleUrls: ['./viewlogindetails.component.css'],
    providers: [Commonservices]
})
export class ViewlogindetailsComponent implements OnInit {
    id: number;
  public itemdetails;
    public userdata2;
    coockieData:CookieService;
    commonservices:Commonservices;
    serverUrl:any;
    public data: any;
    items:any;
    public logindata: any = [];
    private alllogindata: any= [];
    public indate: any;
    public intime: any;
  constructor(private _http: Http,private router: Router, private route: ActivatedRoute, private _sanitizer: DomSanitizer, userdetails:CookieService,  private _commonservices: Commonservices) {
      this.coockieData=userdetails;
      this.userdata2 = userdetails.getObject('userdetails');
      this.commonservices=_commonservices;
      this.items = _commonservices.getItems();
      this.serverUrl = this.items[0].serverUrl;
  }

  ngOnInit() {

      this.route.params.subscribe(params => {
          this.id = params['id'];
      }, error => {

      });


    //var link = 'http://influxiq.com:3001/viewlogindetails';
      var link =this.serverUrl+'viewlogindetails';
    this._http.get(link)
        .subscribe(res => {
          var result = res.json();
         // this.alllogindata = result[0].Userlogindata._id;

          //console.log(this.alllogindata);
         // console.log(result);
          this.itemdetails=result;

        }, error => {
          console.log("Oooops!");
        });
   // this.viewlogindetails();
 /*   this.route.params.subscribe(params => {
      this.mail = params['mail'];
      this.viewlogindetails();
    },error=>{
      console.log(error);
      this.router.navigate(['/employeelist']);
    });*/
  }
/*    details(result: any) {
      console.log("result");
      console.log(result);
      this.data=result;
      console.log(this.data.mailid);
    }*/

details(id: any){
    console.log(id);
    var link =this.serverUrl+'settimein?id='+id;
    console.log(link);
    this._http.get(link)
        .subscribe(res => {
            var result = res.json();
            //console.log(result);
            this.data=result;
            this.indate = this._commonservices.convertunixtodate(this.data[0].Userlogindata.time);
            this.intime = this._commonservices.convertunixtotime(this.data[0].Userlogindata.time);
        }, error => {
            console.log("Oooops!");
        });
}
    submitvalue(){
        console.log(this.data[0]._id);
        var link =this.serverUrl+'setintimeofemployee';
        var data = {
            indate: this.indate,
            intime: this.intime,
            id: this.data[0]._id,
            type: 0 //logout_time
        };
        this._http.post(link, data)
            .subscribe(res => {
                console.log("submitted n redirect");
                $('#myModal').modal('hide');
                this.router.navigate(['/viewlogindetails']);
            }, error => {
                console.log("Oooops!");
            });
    }
}
