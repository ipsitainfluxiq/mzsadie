import { Component, OnInit } from '@angular/core';
import {Http} from "@angular/http";
import { Router, ActivatedRoute} from '@angular/router';
import {DomSanitizer} from "@angular/platform-browser";
import {CookieService} from 'angular2-cookie/core';
import {Commonservices} from "../app.commonservices";
@Component({
  selector: 'app-viewlogindetails',
  templateUrl: './viewlogindetails.component.html',
  styleUrls: ['./viewlogindetails.component.css'],
    providers: [Commonservices]
})
export class ViewlogindetailsComponent implements OnInit {
  public mail;
  public itemdetails;
    public userdata2;
    coockieData:CookieService;
    commonservices:Commonservices;
    serverUrl:any;
    items:any;
  constructor(private _http: Http,private router: Router, private route: ActivatedRoute, private _sanitizer: DomSanitizer, userdetails:CookieService,  private _commonservices: Commonservices) {
      this.coockieData=userdetails;
      this.userdata2 = userdetails.getObject('userdetails');
      this.commonservices=_commonservices;
      this.items = _commonservices.getItems();
      this.serverUrl = this.items[0].serverUrl;
  }

  ngOnInit() {
    //var link = 'http://influxiq.com:3001/viewlogindetails';
      var link =this.serverUrl+'viewlogindetails';
    this._http.get(link)
        .subscribe(res => {
          var result = res.json();
          console.log("hi");
          console.log(result);
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

}
