import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import { Router, ActivatedRoute} from '@angular/router';
import {DomSanitizer} from "@angular/platform-browser";
import {CookieService} from 'angular2-cookie/core';
import {Commonservices} from "../app.commonservices";
declare var $: any;
@Component({
  selector: 'app-viewlogouthistory',
  templateUrl: './viewlogouthistory.component.html',
  styleUrls: ['./viewlogouthistory.component.css'],
  providers: [Commonservices]
})
export class ViewlogouthistoryComponent implements OnInit {
  id: number;
  public itemdetails;
  public userdata2;
  coockieData:CookieService;
  commonservices:Commonservices;
  serverUrl:any;
  items:any;
    public data: any;
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
    var link =this.serverUrl+'viewlogouthistory';
    this._http.get(link)
        .subscribe(res => {
          var result = res.json();
          console.log("hi");
          console.log(result);
          this.itemdetails=result;

        }, error => {
          console.log("Oooops!");
        });
  }
    details(id: any){
        //console.log(id);
        var link =this.serverUrl+'settimeout?id='+id;
        console.log(link);
        this._http.get(link)
            .subscribe(res => {
                var result = res.json();
                //console.log(result);
                this.data=result;
                console.log("one");
                console.log(this.data);
                this.indate = this._commonservices.convertunixtodate(this.data[0].Userlogindata.time);
                this.intime = this._commonservices.convertunixtotime(this.data[0].Userlogindata.time);

                console.log(this.intime);

            }, error => {
                console.log("Oooops!");
            });
    }
    submitvalue(){
      console.log(this.data[0]._id);
        var link =this.serverUrl+'setouttimeofemployee';
        var data = {
            indate: this.indate,
            intime: this.intime,
            id: this.data[0]._id,
            type: 1 //logout_time
        };
        this._http.post(link, data)
            .subscribe(res => {
                $('#myModal').modal('hide');
                this.router.navigate(['/viewlogouthistory']);
            }, error => {
                console.log("Oooops!");
            });
    }
}
